import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
export interface LoginCredentials {
    username: string;
    password: string;
}
export interface AuthTokens {
    accessToken: string;
    user: {
        id: string;
        username: string;
    };
}
export interface JWTPayload {
    userId: string;
    username: string;
    iat?: number;
    exp?: number;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtSecret;
    private readonly jwtExpiresIn;
    constructor(userRepository: IUserRepository, jwtSecret: string, jwtExpiresIn: string);
    login(credentials: LoginCredentials): Promise<AuthTokens>;
    register(credentials: LoginCredentials): Promise<User>;
    verifyToken(token: string): Promise<JWTPayload>;
    private generateAccessToken;
    private hashPassword;
    private verifyPassword;
}
//# sourceMappingURL=AuthService.d.ts.map