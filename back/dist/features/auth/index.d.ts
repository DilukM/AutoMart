import { UserRepository } from './infrastructure/database/repositories/UserRepository';
import { AuthService } from './application/services/AuthService';
import { AuthMiddleware } from './infrastructure/web/middlewares/AuthMiddleware';
import { AuthController } from './presentation/controllers/AuthController';
declare const userRepository: UserRepository;
declare const authService: AuthService;
declare const authMiddleware: AuthMiddleware;
declare const authController: AuthController;
declare const authRouter: import("express").Router;
export { userRepository, authService, authMiddleware, authController, authRouter as authRoutes };
//# sourceMappingURL=index.d.ts.map