"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
class AuthMiddleware {
    constructor(authService) {
        this.authService = authService;
        this.authenticate = async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    res.status(401).json({
                        success: false,
                        error: 'Access token is required'
                    });
                    return;
                }
                const token = authHeader.substring(7);
                const decoded = await this.authService.verifyToken(token);
                req.user = decoded;
                next();
            }
            catch (error) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid or expired token'
                });
            }
        };
        this.requireAdmin = (req, res, next) => {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
                return;
            }
            next();
        };
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map