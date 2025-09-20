"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authRoutes = (authController, authMiddleware) => {
    const router = (0, express_1.Router)();
    router.post("/login", authController.login);
    router.post("/register", authController.register);
    router.get("/profile", authMiddleware.authenticate, authController.getProfile);
    return router;
};
exports.authRoutes = authRoutes;
//# sourceMappingURL=authRoutes.js.map