"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../domain/entities/User");
class AuthService {
    constructor(userRepository, jwtSecret, jwtExpiresIn) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
    }
    async login(credentials) {
        const user = await this.userRepository.findByUsername(credentials.username);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await this.verifyPassword(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const accessToken = this.generateAccessToken(user);
        return {
            accessToken,
            user: {
                id: user.id,
                username: user.username
            }
        };
    }
    async register(credentials) {
        const existingUser = await this.userRepository.findByUsername(credentials.username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        const passwordHash = await this.hashPassword(credentials.password);
        const user = User_1.User.create(credentials.username, passwordHash);
        return await this.userRepository.create({
            username: user.username,
            passwordHash: user.passwordHash
        });
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return decoded;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    generateAccessToken(user) {
        const payload = {
            userId: user.id,
            username: user.username
        };
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn
        });
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt_1.default.hash(password, saltRounds);
    }
    async verifyPassword(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map