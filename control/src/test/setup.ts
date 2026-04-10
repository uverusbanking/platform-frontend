import "@testing-library/jest-dom";
import { vi, afterEach, beforeEach } from "vitest";

// Provide a consistent localStorage/sessionStorage implementation across all
// test environments (jsdom, happy-dom). Some environments (e.g. happy-dom when
// --localstorage-file resolves to an invalid path) expose a degraded object
// that is missing methods like clear().
function makeStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

Object.defineProperty(window, "localStorage", {
  value: makeStorageMock(),
  writable: true,
});

Object.defineProperty(window, "sessionStorage", {
  value: makeStorageMock(),
  writable: true,
});

// Automatically clear all mocks after each test
beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
});
