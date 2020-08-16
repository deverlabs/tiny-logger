import { terser } from 'rollup-plugin-terser'
import typescript from '@wessberg/rollup-plugin-ts'

const plugins = [
  terser({
    compress: false,
    mangle: false,
    output: {
      beautify: true
    }
  })
]

export default [
  // CJS and ESM
  {
    input: './src/index.ts',
    output: [
      {
        format: 'cjs',
        file: 'dist/index.cjs.js',
        sourcemap: true
      },
      {
        format: 'es',
        file: 'dist/index.js',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        tsconfig: (resolvedConfig) => ({ ...resolvedConfig, declaration: true })
      }),
      ...plugins
    ]
  }
  // Concat ts declaration files
]
