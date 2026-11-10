import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react({
      // Exclude custom deck.gl layer files from Babel
      exclude: [/src-ts\/lib\/Tiles3DLayer2\.tsx$/],
    }),
  ],
  resolve: {
    alias: {
      //bypass for internal MeshLayer
      '@deck.gl/geo-layers/dist/mesh-layer/mesh-layer.js': path.resolve(
        import.meta.dirname,
        'node_modules/@deck.gl/geo-layers/dist/mesh-layer/mesh-layer.js',
      ),
    },
  },
  esbuild: {
    target: 'es2020',
  },
})
