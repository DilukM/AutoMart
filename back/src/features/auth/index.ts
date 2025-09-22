import { AppDataSource } from '../../config/database';
import { UserRepository } from './infrastructure/database/repositories/UserRepository';
import { AuthService } from './application/services/AuthService';
import { AuthMiddleware } from './infrastructure/web/middlewares/AuthMiddleware';
import { AuthController } from './presentation/controllers/AuthController';
import { authRoutes } from './presentation/routes/authRoutes';

// Initialize repositories
const userRepository = new UserRepository(AppDataSource.getRepository('UserEntity'));

// Initialize services
const authService = new AuthService(
  userRepository,
  process.env.JWT_SECRET || 'default-secret',
  process.env.JWT_EXPIRES_IN || '24h'
);

// Initialize middleware
const authMiddleware = new AuthMiddleware(authService);

// Initialize controllers
const authController = new AuthController(authService);

// Initialize routes
const authRouter = authRoutes(authController, authMiddleware);

export {
  userRepository,
  authService,
  authMiddleware,
  authController,
  authRouter as authRoutes
};