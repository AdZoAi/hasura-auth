import { RequestHandler } from 'express';

import { gqlSdk } from '@/utils/gqlSDK';
import { sendError } from '@/errors';

export const signOutHandler: RequestHandler<
  {},
  {},
  {
    refreshToken: string;
    all: boolean;
  }
> = async (req, res) => {
  const { refreshToken, all } = req.body;

  if (all) {
    if (!req.auth?.userId) {
      return sendError(
        res,
        'unauthenticated-user',
        'User must be signed in to sign out from all sessions'
      );
    }

    const { userId } = req.auth;

    await gqlSdk.deleteUserRefreshTokens({
      userId,
    });
  } else {
    // only sign out from the current session
    // delete current refresh token
    await gqlSdk.deleteRefreshToken({
      refreshToken,
    });
  }

  return res.send('ok');
};
