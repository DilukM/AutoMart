import {
  IsEnum,
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  Min,
  Max,
  ArrayMinSize,
} from "class-validator";
import { VehicleType } from "@/shared/types/VehicleType";

export class CreateVehicleDTO {
  @IsEnum(VehicleType)
  @IsNotEmpty()
  type!: VehicleType;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsString()
  @IsNotEmpty()
  modelName!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  engineSize!: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year!: number;

  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images!: string[];

  @IsString()
  @IsNotEmpty()
  description!: string;
}
