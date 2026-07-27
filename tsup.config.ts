import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.js' : '.cjs',
    }
  },

  dts: true,
  sourcemap: true,

  target: 'es2022',

  splitting: false,
  treeshake: false,
  clean: true,
})
