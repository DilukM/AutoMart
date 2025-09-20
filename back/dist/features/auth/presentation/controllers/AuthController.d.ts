import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    getProfile: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map