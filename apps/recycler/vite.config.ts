import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@kabadiwala/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@kabadiwala/shared': path.resolve(__dirname, '../../packages/shared/src')
    }
  },
  server: {
    port: 5174,
    host: true
  }
});
