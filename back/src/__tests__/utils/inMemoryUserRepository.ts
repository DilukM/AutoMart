import { IUserRepository, CreateUserData, UpdateUserData } from '@/features/auth/domain/repositories/IUserRepository';
import { User } from '@/features/auth/domain/entities/User';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async create(userData: CreateUserData): Promise<User> {
    const user = User.create(userData.username, userData.passwordHash);
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.username === username) return u;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = user.update(userData.passwordHash);
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }

  async existsByUsername(username: string): Promise<boolean> {
    return (await this.findByUsername(username)) !== null;
  }
}
