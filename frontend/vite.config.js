import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  server: {
    host: true,       // Listen on all addresses (0.0.0.0)
    strictPort: true, // Fail if port 5173 is busy
    port: 5173,
    watch: {
      usePolling: true, // Fixes hot reload in WSL/Docker
    },
     hmr: {
      clientPort: 80,
    }
  }
})