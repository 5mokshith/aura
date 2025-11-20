import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * POST /api/calendar/create
 * Create calendar events with attendees and validate date formats/time zones
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      summary,
      description,
      startTime,
      endTime,
      attendees,
      location,
      timeZone,
    } = body as {
      userId: string;
      summary: string;
      description?: string;
      startTime: string;
      endTime: string;
      attendees?: string[];
      location?: string;
      timeZone?: string;
    };

    // Validate required fields
    if (!userId || !summary || !startTime || !endTime) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId, summary, startTime, and endTime',
        true,
        400
      );
    }

    // Validate date formats (ISO 8601)
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AuraError(
        'INVALID_INPUT',
        'Invalid date format',
        'Please provide dates in ISO 8601 format',
        true,
        400
      );
    }

    if (endDate <= startDate) {
      throw new AuraError(
        'INVALID_INPUT',
        'Invalid date range',
        'End time must be after start time',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Prepare event data
    const event: any = {
      summary,
      description,
      location,
      start: {
        dateTime: startTime,
        timeZone: timeZone || 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: timeZone || 'UTC',
      },
    };

    // Add attendees if provided
    if (attendees && attendees.length > 0) {
      event.attendees = attendees.map((email) => ({ email }));
    }

    // Create event
    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendUpdates: attendees && attendees.length > 0 ? 'all' : 'none',
    });

    return Response.json({
      success: true,
      data: {
        eventId: result.data.id,
        htmlLink: result.data.htmlLink,
        summary: result.data.summary,
        start: result.data.start,
        end: result.data.end,
      },
    });
  } catch (error: any) {
    console.error('Calendar create error:', error);
    return apiErrorResponse(error);
  }
}
