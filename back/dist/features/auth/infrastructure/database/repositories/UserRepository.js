"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../../domain/entities/User");
class UserRepository {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(userData) {
        const userEntity = this.userRepository.create(userData);
        const savedEntity = await this.userRepository.save(userEntity);
        return this.mapEntityToDomain(savedEntity);
    }
    async findById(id) {
        const userEntity = await this.userRepository.findOne({ where: { id } });
        return userEntity ? this.mapEntityToDomain(userEntity) : null;
    }
    async findByUsername(username) {
        const userEntity = await this.userRepository.findOne({ where: { username } });
        return userEntity ? this.mapEntityToDomain(userEntity) : null;
    }
    async update(id, userData) {
        const updateResult = await this.userRepository.update(id, userData);
        if (updateResult.affected && updateResult.affected > 0) {
            const updatedEntity = await this.userRepository.findOne({ where: { id } });
            return updatedEntity ? this.mapEntityToDomain(updatedEntity) : null;
        }
        return null;
    }
    async delete(id) {
        const deleteResult = await this.userRepository.delete(id);
        return deleteResult.affected ? deleteResult.affected > 0 : false;
    }
    async exists(id) {
        const count = await this.userRepository.count({ where: { id } });
        return count > 0;
    }
    async existsByUsername(username) {
        const count = await this.userRepository.count({ where: { username } });
        return count > 0;
    }
    mapEntityToDomain(entity) {
        return new User_1.User(entity.id, entity.username, entity.passwordHash, entity.createdAt, entity.updatedAt);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map