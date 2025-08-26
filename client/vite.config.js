import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/s3Url': process.env.VITE_API_URL || 'http://localhost:3000',
      '/api': process.env.VITE_API_URL || 'http://localhost:3000'
    }
  }
});