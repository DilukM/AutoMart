import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { VehicleType } from "@/shared/types/VehicleType";

@Entity("vehicles")
export class VehicleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: VehicleType,
  })
  type!: VehicleType;

  @Column({ length: 100 })
  brand!: string;

  @Column({ length: 100 })
  modelName!: string;

  @Column({ length: 50 })
  color!: string;

  @Column({ length: 50 })
  engineSize!: string;

  @Column({ type: "int" })
  year!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "json" })
  images!: string[];

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "boolean", default: false })
  isFeatured!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
