import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', //Needed for correct asset loading in Vercel static hosting
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});