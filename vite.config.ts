import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({
    insertTypesEntry: true,
  })],
  build: {
    minify: "terser",
    lib: {
      entry: 'src/index.ts',
      name: 'chartjs-plugin-image-label',
      fileName: (format) => `chartjs-plugin-image-label.${format}.js`,
    },
  },
});
