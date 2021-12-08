import type { Config } from '@jest/types';

const baseConfig: Config.InitialOptions = {
    preset: 'ts-jest',
    verbose: true,
    collectCoverage: true,
    testEnvironment: 'node',
};

export default baseConfig;
