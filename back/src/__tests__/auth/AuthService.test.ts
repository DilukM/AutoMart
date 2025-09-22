import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../features/auth/application/services/AuthService';
import { InMemoryUserRepository } from '../utils/inMemoryUserRepository';

describe('AuthService', () => {
  const jwtSecret = 'test-secret';
  const jwtExpiresIn = '1h';
  let repo: InMemoryUserRepository;
  let service: AuthService;

  beforeEach(() => {
    repo = new InMemoryUserRepository();
    service = new AuthService(repo as any, jwtSecret, jwtExpiresIn);
  });

  it('registers a new user', async () => {
    const user = await service.register({ username: 'alice', password: 'password123' });
    expect(user.username).toBe('alice');
    const all = await repo.findAll();
    expect(all.length).toBe(1);
  });

  it('prevents duplicate usernames', async () => {
    await service.register({ username: 'bob', password: 'secret' });
    await expect(service.register({ username: 'bob', password: 'secret' })).rejects.toThrow('Username already exists');
  });

  it('logs in with valid credentials', async () => {
    const passwordHash = await bcrypt.hash('p@ss', 10);
    await repo.create({ username: 'carol', passwordHash });
    const result = await service.login({ username: 'carol', password: 'p@ss' });
    expect(result.accessToken).toBeTruthy();
    const decoded = jwt.verify(result.accessToken, jwtSecret) as any;
    expect(decoded.username).toBe('carol');
  });

  it('rejects invalid credentials', async () => {
    const passwordHash = await bcrypt.hash('right', 10);
    await repo.create({ username: 'dave', passwordHash });
    await expect(service.login({ username: 'dave', password: 'wrong' })).rejects.toThrow('Invalid credentials');
  });

  it('verifies a valid token', async () => {
    const passwordHash = await bcrypt.hash('abc12345', 10);
    const user = await repo.create({ username: 'erin', passwordHash });
    const token = (service as any).generateAccessToken(user);
    const payload = await service.verifyToken(token);
    expect(payload.username).toBe('erin');
  });
});
