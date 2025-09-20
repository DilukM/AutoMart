import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthMiddleware } from "../../infrastructure/web/middlewares/AuthMiddleware";
export declare const authRoutes: (authController: AuthController, authMiddleware: AuthMiddleware) => Router;
//# sourceMappingURL=authRoutes.d.ts.map