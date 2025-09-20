import { VehicleType } from '../../../shared/types/VehicleType';
export declare class Vehicle {
    readonly id: string;
    readonly type: VehicleType;
    readonly brand: string;
    readonly modelName: string;
    readonly color: string;
    readonly engineSize: string;
    readonly year: number;
    readonly price: number;
    readonly images: string[];
    readonly description: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, type: VehicleType, brand: string, modelName: string, color: string, engineSize: string, year: number, price: number, images: string[], description: string, createdAt: Date, updatedAt: Date);
    static create(type: VehicleType, brand: string, modelName: string, color: string, engineSize: string, year: number, price: number, images: string[], description: string): Vehicle;
    update(type?: VehicleType, brand?: string, modelName?: string, color?: string, engineSize?: string, year?: number, price?: number, images?: string[], description?: string): Vehicle;
}
//# sourceMappingURL=Vehicle.d.ts.map