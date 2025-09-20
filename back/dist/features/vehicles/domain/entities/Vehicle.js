"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
class Vehicle {
    constructor(id, type, brand, modelName, color, engineSize, year, price, images, description, createdAt, updatedAt) {
        this.id = id;
        this.type = type;
        this.brand = brand;
        this.modelName = modelName;
        this.color = color;
        this.engineSize = engineSize;
        this.year = year;
        this.price = price;
        this.images = images;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(type, brand, modelName, color, engineSize, year, price, images, description) {
        const id = crypto.randomUUID();
        const now = new Date();
        return new Vehicle(id, type, brand, modelName, color, engineSize, year, price, images, description, now, now);
    }
    update(type, brand, modelName, color, engineSize, year, price, images, description) {
        return new Vehicle(this.id, type ?? this.type, brand ?? this.brand, modelName ?? this.modelName, color ?? this.color, engineSize ?? this.engineSize, year ?? this.year, price ?? this.price, images ?? this.images, description ?? this.description, this.createdAt, new Date());
    }
}
exports.Vehicle = Vehicle;
//# sourceMappingURL=Vehicle.js.map