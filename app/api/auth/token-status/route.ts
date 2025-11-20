import { NextRequest } from 'next/server';
import { getUserTokens, validateToken, getExpirationTimeString } from '@/app/lib/auth/token';
import { apiErrorResponse, apiSuccessResponse } from '@/app/lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return apiErrorResponse({
        code: 'INVALID_INPUT',
        message: 'User ID is required',
        status: 400,
      });
    }

    const tokens = await getUserTokens(userId);
    const validation = validateToken(tokens);

    const response = {
      isValid: validation.isValid,
      isExpired: validation.isExpired,
      expiresIn: validation.expiresIn,
      needsRefresh: validation.needsRefresh,
      expirationText: validation.expiresIn
        ? getExpirationTimeString(validation.expiresIn)
        : undefined,
    };

    return apiSuccessResponse(response);
  } catch (error: any) {
    return apiErrorResponse(error);
  }
}
