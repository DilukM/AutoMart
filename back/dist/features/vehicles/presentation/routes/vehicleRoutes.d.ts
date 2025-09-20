import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { AuthMiddleware } from "../../../auth/infrastructure/web/middlewares/AuthMiddleware";
export declare const vehicleRoutes: (vehicleController: VehicleController, authMiddleware: AuthMiddleware) => Router;
//# sourceMappingURL=vehicleRoutes.d.ts.map