"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = require("express");
const vehicleRoutes = (vehicleController, authMiddleware) => {
    const router = (0, express_1.Router)();
    router.get("/", vehicleController.getAllVehicles);
    router.get("/:id", vehicleController.getVehicleById);
    router.post("/", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.createVehicle);
    router.put("/:id", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.updateVehicle);
    router.delete("/:id", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.deleteVehicle);
    router.patch("/:id/description", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.regenerateDescription);
    return router;
};
exports.vehicleRoutes = vehicleRoutes;
//# sourceMappingURL=vehicleRoutes.js.map