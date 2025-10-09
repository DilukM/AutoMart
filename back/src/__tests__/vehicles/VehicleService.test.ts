import { VehicleService } from "../../features/vehicles/application/services/VehicleService";
import { InMemoryVehicleRepository } from "../utils/inMemoryVehicleRepository";
import { VehicleType } from "../../shared/types/VehicleType";

class FakeAIService {
  isConfigured() {
    return true;
  }
  async generateVehicleDescription() {
    return "AI generated description";
  }
}

describe("VehicleService", () => {
  let repo: InMemoryVehicleRepository;
  let service: VehicleService;

  beforeEach(() => {
    repo = new InMemoryVehicleRepository();
    service = new VehicleService(repo as any, new FakeAIService() as any);
  });

  const baseData = {
    type: VehicleType.CAR,
    brand: "Toyota",
    modelName: "Corolla",
    color: "Blue",
    engineSize: "1.8L",
    year: 2022,
    price: 25000,
    images: ["http://img.url/a.jpg"],
    description: "Nice car",
    isFeatured: false,
  };

  it("creates a vehicle", async () => {
    const v = await service.createVehicle(baseData);
    expect(v.id).toBeTruthy();
    const fetched = await service.getVehicleById(v.id);
    expect(fetched?.brand).toBe("Toyota");
  });

  it("validates required fields", async () => {
    await expect(
      service.createVehicle({ ...(baseData as any), brand: "" })
    ).rejects.toThrow("Brand is required");
  });

  it("requires non-empty description (current validation)", async () => {
    await expect(
      service.createVehicle({ ...baseData, description: "" })
    ).rejects.toThrow("Description is required");
  });

  it("updates a vehicle", async () => {
    const v = await service.createVehicle(baseData);
    const updated = await service.updateVehicle(v.id, { price: 26000 });
    expect(updated?.price).toBe(26000);
  });

  it("deletes a vehicle", async () => {
    const v = await service.createVehicle(baseData);
    const ok = await service.deleteVehicle(v.id);
    expect(ok).toBe(true);
  });

  it("orders featured vehicles first", async () => {
    // Create a regular vehicle first
    const regularVehicle = await service.createVehicle({
      ...baseData,
      brand: "Honda",
      isFeatured: false,
    });

    // Create a featured vehicle second (should appear first despite being created later)
    const featuredVehicle = await service.createVehicle({
      ...baseData,
      brand: "BMW",
      isFeatured: true,
    });

    // Get all vehicles
    const result = await service.getAllVehicles();

    // Should have 2 vehicles
    expect(result.vehicles).toHaveLength(2);

    // Featured vehicle should be first
    expect(result.vehicles[0]!.id).toBe(featuredVehicle.id);
    expect(result.vehicles[0]!.isFeatured).toBe(true);
    expect(result.vehicles[1]!.id).toBe(regularVehicle.id);
    expect(result.vehicles[1]!.isFeatured).toBe(false);
  });

  it("filters featured vehicles", async () => {
    // Create one featured and one regular vehicle
    await service.createVehicle({
      ...baseData,
      brand: "Honda",
      isFeatured: false,
    });
    const featuredVehicle = await service.createVehicle({
      ...baseData,
      brand: "BMW",
      isFeatured: true,
    });

    // Filter for featured vehicles only
    const result = await service.getAllVehicles({ isFeatured: true });

    expect(result.vehicles).toHaveLength(1);
    expect(result.vehicles[0]!.id).toBe(featuredVehicle.id);
    expect(result.vehicles[0]!.isFeatured).toBe(true);
  });
});
