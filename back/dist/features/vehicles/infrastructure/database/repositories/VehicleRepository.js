"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const Vehicle_1 = require("../../../domain/entities/Vehicle");
class VehicleRepository {
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async create(vehicleData) {
        const vehicleEntity = this.vehicleRepository.create(vehicleData);
        const savedEntity = await this.vehicleRepository.save(vehicleEntity);
        return this.mapEntityToDomain(savedEntity);
    }
    async findById(id) {
        const vehicleEntity = await this.vehicleRepository.findOne({ where: { id } });
        return vehicleEntity ? this.mapEntityToDomain(vehicleEntity) : null;
    }
    async findAll(filters, page = 1, limit = 10) {
        const queryBuilder = this.vehicleRepository.createQueryBuilder('vehicle');
        if (filters) {
            if (filters.type) {
                queryBuilder.andWhere('vehicle.type = :type', { type: filters.type });
            }
            if (filters.brand) {
                queryBuilder.andWhere('vehicle.brand LIKE :brand', { brand: `%${filters.brand}%` });
            }
            if (filters.modelName) {
                queryBuilder.andWhere('vehicle.modelName LIKE :modelName', { modelName: `%${filters.modelName}%` });
            }
            if (filters.color) {
                queryBuilder.andWhere('vehicle.color = :color', { color: filters.color });
            }
            if (filters.engineSize) {
                queryBuilder.andWhere('vehicle.engineSize = :engineSize', { engineSize: filters.engineSize });
            }
            if (filters.year) {
                queryBuilder.andWhere('vehicle.year = :year', { year: filters.year });
            }
            if (filters.minPrice) {
                queryBuilder.andWhere('vehicle.price >= :minPrice', { minPrice: filters.minPrice });
            }
            if (filters.maxPrice) {
                queryBuilder.andWhere('vehicle.price <= :maxPrice', { maxPrice: filters.maxPrice });
            }
        }
        const [entities, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        const vehicles = entities.map(entity => this.mapEntityToDomain(entity));
        return {
            vehicles,
            total,
            page,
            limit
        };
    }
    async update(id, vehicleData) {
        const updateResult = await this.vehicleRepository.update(id, vehicleData);
        if (updateResult.affected && updateResult.affected > 0) {
            const updatedEntity = await this.vehicleRepository.findOne({ where: { id } });
            return updatedEntity ? this.mapEntityToDomain(updatedEntity) : null;
        }
        return null;
    }
    async delete(id) {
        const deleteResult = await this.vehicleRepository.delete(id);
        return deleteResult.affected ? deleteResult.affected > 0 : false;
    }
    async exists(id) {
        const count = await this.vehicleRepository.count({ where: { id } });
        return count > 0;
    }
    mapEntityToDomain(entity) {
        return new Vehicle_1.Vehicle(entity.id, entity.type, entity.brand, entity.modelName, entity.color, entity.engineSize, entity.year, entity.price, entity.images, entity.description, entity.createdAt, entity.updatedAt);
    }
}
exports.VehicleRepository = VehicleRepository;
//# sourceMappingURL=VehicleRepository.js.map