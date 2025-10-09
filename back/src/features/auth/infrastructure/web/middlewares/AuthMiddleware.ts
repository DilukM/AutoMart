import { Request, Response, NextFunction } from 'express';
import { AuthService, JWTPayload } from '../../../application/services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: 'Access token is required'
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      const decoded = await this.authService.verifyToken(token);
      req.user = decoded;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  };

  requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // For now, all authenticated users are considered admins
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    next();
  };
}