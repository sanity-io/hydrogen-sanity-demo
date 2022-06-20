import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen()],
  optimizeDeps: {include: ['@headlessui/react']},
});
