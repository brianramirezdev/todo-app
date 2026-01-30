import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock de IntersectionObserver (necesario para Radix UI)
class IntersectionObserverMock {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
});

// Mock de ResizeObserver (necesario para Radix UI)
class ResizeObserverMock {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
}

Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserverMock,
});

// Mock de matchMedia (necesario para ThemeProvider)
Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Cleanup después de cada test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
