import { VehicleService } from '../../features/vehicles/application/services/VehicleService';
import { InMemoryVehicleRepository } from '../utils/inMemoryVehicleRepository';
import { VehicleType } from '../../shared/types/VehicleType';

class FakeAIService {
  isConfigured() { return true; }
  async generateVehicleDescription() { return 'AI generated description'; }
}

describe('VehicleService', () => {
  let repo: InMemoryVehicleRepository;
  let service: VehicleService;

  beforeEach(() => {
    repo = new InMemoryVehicleRepository();
    service = new VehicleService(repo as any, new FakeAIService() as any);
  });

  const baseData = {
    type: VehicleType.CAR,
    brand: 'Toyota',
    modelName: 'Corolla',
    color: 'Blue',
    engineSize: '1.8L',
    year: 2022,
    price: 25000,
    images: ['http://img.url/a.jpg'],
    description: 'Nice car',
  };

  it('creates a vehicle', async () => {
    const v = await service.createVehicle(baseData);
    expect(v.id).toBeTruthy();
    const fetched = await service.getVehicleById(v.id);
    expect(fetched?.brand).toBe('Toyota');
  });

  it('validates required fields', async () => {
    await expect(service.createVehicle({ ...(baseData as any), brand: '' })).rejects.toThrow('Brand is required');
  });

  it('requires non-empty description (current validation)', async () => {
    await expect(service.createVehicle({ ...baseData, description: '' })).rejects.toThrow('Description is required');
  });

  it('updates a vehicle', async () => {
    const v = await service.createVehicle(baseData);
    const updated = await service.updateVehicle(v.id, { price: 26000 });
    expect(updated?.price).toBe(26000);
  });

  it('deletes a vehicle', async () => {
    const v = await service.createVehicle(baseData);
    const ok = await service.deleteVehicle(v.id);
    expect(ok).toBe(true);
  });
});
