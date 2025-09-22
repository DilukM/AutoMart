// Jest setup file
import "reflect-metadata";

// Ensure NODE_ENV is test
process.env.NODE_ENV = process.env.NODE_ENV || "test";

// Provide default JWT envs to avoid service constructor errors in tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Silence noisy console.info/warn in tests (can be toggled per test)
const originalWarn = console.warn;
const originalInfo = console.info;
beforeAll(() => {
  console.warn = jest.fn();
  console.info = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
  console.info = originalInfo;
});

// Ensure crypto.randomUUID exists in test env
try {
  // @ts-ignore
  if (
    !globalThis.crypto ||
    typeof (globalThis.crypto as any).randomUUID !== "function"
  ) {
    const { randomUUID } = require("crypto");
    // @ts-ignore
    globalThis.crypto = { ...(globalThis.crypto || {}), randomUUID };
  }
} catch {}

export {};
