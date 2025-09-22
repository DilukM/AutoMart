import { Request, Response } from 'express';
import { AuthService, LoginCredentials } from '../../application/services/AuthService';
import { createError } from '../../../../shared/middleware/errorHandler';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginCredentials = req.body;

      if (!credentials.username || !credentials.password) {
        throw createError('Username and password are required', 400);
      }

      const authResult = await this.authService.login(credentials);

      res.status(200).json({
        success: true,
        data: authResult
      });
    } catch (error) {
      const statusCode = (error as any).statusCode || 401;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message
      });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginCredentials = req.body;

      if (!credentials.username || !credentials.password) {
        throw createError('Username and password are required', 400);
      }

      if (credentials.password.length < 6) {
        throw createError('Password must be at least 6 characters long', 400);
      }

      const user = await this.authService.register(credentials);

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      const statusCode = (error as any).statusCode || 400;
      res.status(statusCode).json({
        success: false,
        error: (error as Error).message
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // User info is available from auth middleware
      const user = (req as any).user;

      res.status(200).json({
        success: true,
        data: {
          id: user.userId,
          username: user.username
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.authService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users.map(user => ({
          id: user.id,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get users'
      });
    }
  };
}