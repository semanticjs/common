import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';

const baseConfig = createBasicConfig();

export default [
  merge(baseConfig, {
    input: './src/index.ts',
    output: [
      {
        dir: 'packages/esm',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.esm.json' })],
  }),
  merge(baseConfig, {
    input: './src/index.ts',
    output: [
      {
        dir: 'packages/cjs',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.cjs.json' })],
  }),
];
