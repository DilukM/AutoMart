import { Request, Response, NextFunction } from 'express';
import { AuthService, JWTPayload } from '../../../application/services/AuthService';
export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}
export declare class AuthMiddleware {
    private readonly authService;
    constructor(authService: AuthService);
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=AuthMiddleware.d.ts.map