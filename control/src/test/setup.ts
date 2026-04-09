import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";

// Automatically clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
