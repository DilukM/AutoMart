import { UserRepository } from './infrastructure/database/repositories/UserRepository';
import { AuthService } from './application/services/AuthService';
import { AuthMiddleware } from './infrastructure/web/middlewares/AuthMiddleware';
import { AuthController } from './presentation/controllers/AuthController';
declare const userRepository: UserRepository;
declare const authService: AuthService;
declare const authMiddleware: AuthMiddleware;
declare const authController: AuthController;
declare const authRoutes: any;
export { userRepository, authService, authMiddleware, authController, authRoutes };
//# sourceMappingURL=index.d.ts.map