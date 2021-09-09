import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
// import typescript from '@rollup/plugin-typescript';

const baseConfig = createBasicConfig();

export default [
  {
    input: './packages/esm/index.js',
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: true,
      },
    ],
    // plugins: [typescript({ tsconfig: './tsconfig.esm.json' })],
  },
  // merge(baseConfig, {
  //   input: './packages/cjs/index.js',
  //   output: [
  //     {
  //       dir: 'dist/cjs',
  //       format: 'cjs',
  //       sourcemap: true,
  //     },
  //   ],
  //   // plugins: [typescript({ tsconfig: './tsconfig.cjs.json' })],
  // }),
];
