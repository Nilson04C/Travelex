import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@server": "/server", // Alias para o código do servidor
    },
  },
  build: {
    rollupOptions: {
      external: ["@server"], // Exclui o código do servidor do bundle
    },
  },
});