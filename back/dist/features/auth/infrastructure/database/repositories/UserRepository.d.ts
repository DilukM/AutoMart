import { Repository } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { User } from '../../../domain/entities/User';
import { IUserRepository, CreateUserData, UpdateUserData } from '../../../domain/repositories/IUserRepository';
export declare class UserRepository implements IUserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    create(userData: CreateUserData): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    update(id: string, userData: UpdateUserData): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    exists(id: string): Promise<boolean>;
    existsByUsername(username: string): Promise<boolean>;
    private mapEntityToDomain;
}
//# sourceMappingURL=UserRepository.d.ts.map