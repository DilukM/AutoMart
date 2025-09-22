import request from "supertest";

// Mock database module to prevent real DB initialization during tests
jest.mock("@/config/database", () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  AppDataSource: { getRepository: jest.fn(() => ({})) },
}));

// Import the Vercel app which defines /health without needing DB
// Use relative path here to avoid IDE path-alias squiggles in tests (excluded by tsconfig)
import app from "../..";

describe("Health API", () => {
  it("GET /health returns OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });
});
