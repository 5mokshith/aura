import { google } from 'googleapis';
import { BaseWorker } from './base';
import { WorkerResult, PlanStep } from '@/app/types/agent';

/**
 * Worker agent for Google Calendar operations
 */
export class CalendarWorker extends BaseWorker {
  constructor() {
    super('calendar');
  }

  async executeStep(step: PlanStep, userId: string): Promise<WorkerResult> {
    try {
      const auth = await this.getAuthClient(userId);
      const calendar = google.calendar({ version: 'v3', auth });

      switch (step.action) {
        case 'create':
          return await this.createEvent(step, calendar);
        case 'list':
          return await this.listEvents(step, calendar);
        case 'delete':
          return await this.deleteEvent(step, calendar);
        default:
          throw new Error(`Unknown Calendar action: ${step.action}`);
      }
    } catch (error) {
      return this.createErrorResult(
        step.id,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private async createEvent(step: PlanStep, calendar: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['summary', 'startTime', 'endTime']);

    const params = step.parameters || {};
    const {
      summary,
      description,
      startTime,
      endTime,
      attendees,
      location,
      timeZone = 'UTC',
    } = params;

    const event = {
      summary,
      description,
      location,
      start: {
        dateTime: startTime,
        timeZone,
      },
      end: {
        dateTime: endTime,
        timeZone,
      },
      attendees: attendees?.map((email: string) => ({ email })),
    };

    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return this.createSuccessResult(step.id, {
      type: 'calendar_event',
      title: summary,
      googleId: result.data.id,
      url: result.data.htmlLink,
      data: {
        eventId: result.data.id,
        summary: result.data.summary,
        start: result.data.start,
        end: result.data.end,
        htmlLink: result.data.htmlLink,
        attendees: result.data.attendees,
      },
    });
  }

  private async listEvents(step: PlanStep, calendar: any): Promise<WorkerResult> {
    const {
      timeMin,
      timeMax,
      maxResults = 10,
      orderBy = 'startTime',
    } = step.parameters || {};

    const params: any = {
      calendarId: 'primary',
      maxResults,
      singleEvents: true,
      orderBy,
    };

    if (timeMin) params.timeMin = timeMin;
    if (timeMax) params.timeMax = timeMax;

    const result = await calendar.events.list(params);

    const events = (result.data.items || []).map((event: any) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      location: event.location,
      htmlLink: event.htmlLink,
      attendees: event.attendees,
    }));

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: `Found ${events.length} events`,
      data: {
        totalEvents: events.length,
        events,
        timeMin,
        timeMax,
      },
    });
  }

  private async deleteEvent(step: PlanStep, calendar: any): Promise<WorkerResult> {
    this.validateParameters(step.parameters || {}, ['eventId']);

    const { eventId } = step.parameters || {};

    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });

    return this.createSuccessResult(step.id, {
      type: 'data',
      title: 'Event deleted',
      data: {
        eventId,
        deleted: true,
      },
    });
  }
}

export const calendarWorker = new CalendarWorker();
