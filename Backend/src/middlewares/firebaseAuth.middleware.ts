import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/firebase';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';

export interface FirebaseAuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export function firebaseAuthMiddleware(
  req: FirebaseAuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authentication required', 401);
    return;
  }

  const idToken = authHeader.substring(7); // Remove "Bearer " prefix
  getAuth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
      next();
    })
    .catch(error => {
      logger.warn('Invalid Firebase token', { error: error.message });
      sendError(res, 'Invalid or expired token', 401);
      return;
    });
}
