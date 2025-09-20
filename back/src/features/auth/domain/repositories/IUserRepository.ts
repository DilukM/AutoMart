import { User } from '../entities/User';

export interface CreateUserData {
  username: string;
  passwordHash: string;
}

export interface UpdateUserData {
  passwordHash?: string;
}

export interface IUserRepository {
  create(userData: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, userData: UpdateUserData): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
}