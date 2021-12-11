import type { Config } from '@jest/types';

const baseConfig: Config.InitialOptions = {
    preset: 'ts-jest',
    verbose: true,
    collectCoverage: true,
    testEnvironment: 'node',
    testPathIgnorePatterns: ['build'],
    coveragePathIgnorePatterns: ['lib/convert.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'esbuild-jest',
            {
                sourcemap: true,
                platform: 'node',
            },
        ],
    },
};

export default baseConfig;
