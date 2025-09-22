import { Repository } from "typeorm";
import { VehicleEntity } from "../entities/VehicleEntity";
import { Vehicle } from "../../../domain/entities/Vehicle";
import {
  IVehicleRepository,
  CreateVehicleData,
  UpdateVehicleData,
  VehicleSearchFilters,
  VehicleSearchResult,
} from "../../../domain/repositories/IVehicleRepository";
import { VehicleType } from "@/shared/types/VehicleType";

export class VehicleRepository implements IVehicleRepository {
  constructor(private readonly vehicleRepository: Repository<VehicleEntity>) {}

  async create(vehicleData: CreateVehicleData): Promise<Vehicle> {
    const vehicleEntity = this.vehicleRepository.create(vehicleData);
    const savedEntity = await this.vehicleRepository.save(vehicleEntity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findById(id: string): Promise<Vehicle | null> {
    const vehicleEntity = await this.vehicleRepository.findOne({
      where: { id },
    });
    return vehicleEntity ? this.mapEntityToDomain(vehicleEntity) : null;
  }

  async findAll(
    filters?: VehicleSearchFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<VehicleSearchResult> {
    const queryBuilder = this.vehicleRepository.createQueryBuilder("vehicle");

    if (filters) {
      if (filters.type) {
        queryBuilder.andWhere("vehicle.type = :type", { type: filters.type });
      }
      if (filters.brand) {
        queryBuilder.andWhere("vehicle.brand LIKE :brand", {
          brand: `%${filters.brand}%`,
        });
      }
      if (filters.modelName) {
        queryBuilder.andWhere("vehicle.modelName LIKE :modelName", {
          modelName: `%${filters.modelName}%`,
        });
      }
      if (filters.color) {
        queryBuilder.andWhere("vehicle.color = :color", {
          color: filters.color,
        });
      }
      if (filters.engineSize) {
        queryBuilder.andWhere("vehicle.engineSize = :engineSize", {
          engineSize: filters.engineSize,
        });
      }
      if (filters.year) {
        queryBuilder.andWhere("vehicle.year = :year", { year: filters.year });
      }
      if (filters.yearMin) {
        queryBuilder.andWhere("vehicle.year >= :yearMin", {
          yearMin: filters.yearMin,
        });
      }
      if (filters.yearMax) {
        queryBuilder.andWhere("vehicle.year <= :yearMax", {
          yearMax: filters.yearMax,
        });
      }
      if (filters.minPrice) {
        queryBuilder.andWhere("vehicle.price >= :minPrice", {
          minPrice: filters.minPrice,
        });
      }
      if (filters.maxPrice) {
        queryBuilder.andWhere("vehicle.price <= :maxPrice", {
          maxPrice: filters.maxPrice,
        });
      }
    }

    const [entities, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const vehicles = entities.map((entity) => this.mapEntityToDomain(entity));

    return {
      vehicles,
      total,
      page,
      limit,
    };
  }

  async update(
    id: string,
    vehicleData: UpdateVehicleData
  ): Promise<Vehicle | null> {
    const updateResult = await this.vehicleRepository.update(id, vehicleData);
    if (updateResult.affected && updateResult.affected > 0) {
      const updatedEntity = await this.vehicleRepository.findOne({
        where: { id },
      });
      return updatedEntity ? this.mapEntityToDomain(updatedEntity) : null;
    }
    return null;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.vehicleRepository.delete(id);
    return deleteResult.affected ? deleteResult.affected > 0 : false;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.vehicleRepository.count({ where: { id } });
    return count > 0;
  }

  private mapEntityToDomain(entity: VehicleEntity): Vehicle {
    return new Vehicle(
      entity.id,
      entity.type,
      entity.brand,
      entity.modelName,
      entity.color,
      entity.engineSize,
      entity.year,
      entity.price,
      entity.images,
      entity.description,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
