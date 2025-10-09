import { VehicleType } from "@/shared/types/VehicleType";

export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly type: VehicleType,
    public readonly brand: string,
    public readonly modelName: string,
    public readonly color: string,
    public readonly engineSize: string,
    public readonly year: number,
    public readonly price: number,
    public readonly images: string[],
    public readonly description: string,
    public readonly isFeatured: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    type: VehicleType,
    brand: string,
    modelName: string,
    color: string,
    engineSize: string,
    year: number,
    price: number,
    images: string[],
    description: string,
    isFeatured: boolean = false
  ): Vehicle {
    const id = crypto.randomUUID();
    const now = new Date();
    return new Vehicle(
      id,
      type,
      brand,
      modelName,
      color,
      engineSize,
      year,
      price,
      images,
      description,
      isFeatured,
      now,
      now
    );
  }

  update(
    type?: VehicleType,
    brand?: string,
    modelName?: string,
    color?: string,
    engineSize?: string,
    year?: number,
    price?: number,
    images?: string[],
    description?: string,
    isFeatured?: boolean
  ): Vehicle {
    return new Vehicle(
      this.id,
      type ?? this.type,
      brand ?? this.brand,
      modelName ?? this.modelName,
      color ?? this.color,
      engineSize ?? this.engineSize,
      year ?? this.year,
      price ?? this.price,
      images ?? this.images,
      description ?? this.description,
      isFeatured ?? this.isFeatured,
      this.createdAt,
      new Date()
    );
  }
}
