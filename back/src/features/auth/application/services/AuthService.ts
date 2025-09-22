import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
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

  async register(credentials: LoginCredentials): Promise<User> {
    const existingUser = await this.userRepository.findByUsername(credentials.username);

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const passwordHash = await this.hashPassword(credentials.password);

    const user = User.create(credentials.username, passwordHash);

    return await this.userRepository.create({
      username: user.username,
      passwordHash: user.passwordHash
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateAccessToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}