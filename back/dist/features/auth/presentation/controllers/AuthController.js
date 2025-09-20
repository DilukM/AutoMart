"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const errorHandler_1 = require("../../../../shared/middleware/errorHandler");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = async (req, res) => {
            try {
                const credentials = req.body;
                if (!credentials.username || !credentials.password) {
                    throw (0, errorHandler_1.createError)('Username and password are required', 400);
                }
                const authResult = await this.authService.login(credentials);
                res.status(200).json({
                    success: true,
                    data: authResult
                });
            }
            catch (error) {
                const statusCode = error.statusCode || 401;
                res.status(statusCode).json({
                    success: false,
                    error: error.message
                });
            }
        };
        this.register = async (req, res) => {
            try {
                const credentials = req.body;
                if (!credentials.username || !credentials.password) {
                    throw (0, errorHandler_1.createError)('Username and password are required', 400);
                }
                if (credentials.password.length < 6) {
                    throw (0, errorHandler_1.createError)('Password must be at least 6 characters long', 400);
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
            }
            catch (error) {
                const statusCode = error.statusCode || 400;
                res.status(statusCode).json({
                    success: false,
                    error: error.message
                });
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const user = req.user;
                res.status(200).json({
                    success: true,
                    data: {
                        id: user.userId,
                        username: user.username
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get user profile'
                });
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map