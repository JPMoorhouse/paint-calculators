import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
      }),
    ],
    external: [],
  },
  // Individual calculator bundles for direct import
  {
    input: 'src/calculators/coverage.ts',
    output: {
      file: 'dist/coverage.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript()],
  },
  {
    input: 'src/calculators/environmental.ts',
    output: {
      file: 'dist/environmental.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript()],
  },
  {
    input: 'src/calculators/cost.ts',
    output: {
      file: 'dist/cost.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript()],
  },
  {
    input: 'src/calculators/technical.ts',
    output: {
      file: 'dist/technical.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript()],
  },
];