module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom', // Para backend cambiar jsdom por node para cambiar el entorno de ejecución de los test
    coverageDirectory: './coverage/',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/main.ts'],
    coverageThreshold: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],
    testTimeout: 10000
};
