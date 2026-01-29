module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/index.ts'],
    coverageDirectory: 'coverage',
    verbose: true,

    // Mapeo de path aliases (debe coincidir con tsconfig.json)
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
        '^@entities/(.*)$': '<rootDir>/src/entities/$1',
        '^@migrations/(.*)$': '<rootDir>/src/migrations/$1',
        '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    },
};
