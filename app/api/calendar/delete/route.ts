import { google } from 'googleapis';
import { getOAuth2Client } from '@/app/lib/google/auth';
import { apiErrorResponse, AuraError } from '@/app/lib/errorHandler';

/**
 * DELETE /api/calendar/delete
 * Delete events by ID and handle calendar conflicts
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, eventId, sendUpdates } = body as {
      userId: string;
      eventId: string;
      sendUpdates?: boolean;
    };

    // Validate required fields
    if (!userId || !eventId) {
      throw new AuraError(
        'INVALID_INPUT',
        'Missing required fields',
        'Please provide userId and eventId',
        true,
        400
      );
    }

    // Get authenticated OAuth2 client
    const oauth2Client = await getOAuth2Client(userId);
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Check if event exists first
    try {
      await calendar.events.get({
        calendarId: 'primary',
        eventId,
      });
    } catch (error: any) {
      if (error.code === 404) {
        throw new AuraError(
          'INVALID_INPUT',
          'Event not found',
          'The specified event does not exist or has already been deleted',
          true,
          404
        );
      }
      throw error;
    }

    // Delete event
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
      sendUpdates: sendUpdates ? 'all' : 'none',
    });

    return Response.json({
      success: true,
      data: {
        eventId,
        deleted: true,
      },
    });
  } catch (error: any) {
    console.error('Calendar delete error:', error);
    return apiErrorResponse(error);
  }
}
