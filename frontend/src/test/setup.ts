import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

// Mock de IntersectionObserver
Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })),
});

afterEach(() => {
    vi.clearAllMocks();
});
