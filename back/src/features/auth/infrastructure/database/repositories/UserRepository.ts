import { Repository } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { User } from '../../../domain/entities/User';
import { IUserRepository, CreateUserData, UpdateUserData } from '../../../domain/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  constructor(private readonly userRepository: Repository<UserEntity>) {}

  async create(userData: CreateUserData): Promise<User> {
    const userEntity = this.userRepository.create(userData);
    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? this.mapEntityToDomain(userEntity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { username } });
    return userEntity ? this.mapEntityToDomain(userEntity) : null;
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const updateResult = await this.userRepository.update(id, userData);
    if (updateResult.affected && updateResult.affected > 0) {
      const updatedEntity = await this.userRepository.findOne({ where: { id } });
      return updatedEntity ? this.mapEntityToDomain(updatedEntity) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.userRepository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } });
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { username } });
    return count > 0;
  }

  private mapEntityToDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.username,
      entity.passwordHash,
      entity.createdAt,
      entity.updatedAt
    );
  }
}