import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@molecules': path.resolve(__dirname, './src/components/molecules'),
      '@atoms': path.resolve(__dirname, './src/components/atoms'),
      '@organismes': path.resolve(__dirname, './src/components/organismes'),
      '@services': path.resolve(__dirname, './src/services'),
      '@views': path.resolve(__dirname, './src/views'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    }
  }
})
