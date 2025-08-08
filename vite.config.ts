import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',  // Important for correct asset loading on Vercel
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});