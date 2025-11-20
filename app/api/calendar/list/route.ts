import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * GET /api/calendar/list
 * Fetch events within date range and return formatted event list
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');
    const maxResults = parseInt(searchParams.get('maxResults') || '10');

    // Validate required fields
    if (!userId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing userId parameter',
        'Please provide userId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Prepare query parameters
    const queryParams: any = {
      calendarId: 'primary',
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    };

    // Add time range if provided
    if (timeMin) {
      queryParams.timeMin = timeMin;
    } else {
      // Default to current time
      queryParams.timeMin = new Date().toISOString();
    }

    if (timeMax) {
      queryParams.timeMax = timeMax;
    }

    // Fetch events
    const result = await calendar.events.list(queryParams);

    const events = (result.data.items || []).map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      htmlLink: event.htmlLink,
      attendees: event.attendees?.map((a) => ({
        email: a.email,
        responseStatus: a.responseStatus,
      })),
      status: event.status,
    }));

    return Response.json({
      success: true,
      data: {
        events,
        count: events.length,
      },
    });
  } catch (error: any) {
    console.error('Calendar list error:', error);
    return apiErrorResponse(error);
  }
}
