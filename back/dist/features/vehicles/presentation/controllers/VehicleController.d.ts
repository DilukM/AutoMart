import { Request, Response } from "express";
import { VehicleService } from "../../application/services/VehicleService";
import { ImageUploadService } from "../../application/services/ImageUploadService";
export declare class VehicleController {
    private readonly vehicleService;
    private readonly imageUploadService;
    constructor(vehicleService: VehicleService, imageUploadService: ImageUploadService);
    createVehicle(req: Request, res: Response): Promise<void>;
    getVehicleById(req: Request, res: Response): Promise<void>;
    getAllVehicles(req: Request, res: Response): Promise<void>;
    updateVehicle(req: Request, res: Response): Promise<void>;
    deleteVehicle(req: Request, res: Response): Promise<void>;
    regenerateDescription(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=VehicleController.d.ts.map