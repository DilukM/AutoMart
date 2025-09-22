"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const vehicleRoutes = (vehicleController, authMiddleware) => {
    const router = (0, express_1.Router)();
    const storage = multer_1.default.memoryStorage();
    const upload = (0, multer_1.default)({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024,
            files: 10
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });
    router.get("/", vehicleController.getAllVehicles);
    router.get("/:id", vehicleController.getVehicleById);
    router.post("/", authMiddleware.authenticate, authMiddleware.requireAdmin, upload.array('images', 10), vehicleController.createVehicle);
    router.put("/:id", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.updateVehicle);
    router.delete("/:id", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.deleteVehicle);
    router.patch("/:id/description", authMiddleware.authenticate, authMiddleware.requireAdmin, vehicleController.regenerateDescription);
    return router;
};
exports.vehicleRoutes = vehicleRoutes;
//# sourceMappingURL=vehicleRoutes.js.map