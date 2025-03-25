import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // A porta que você deseja usar
    hmr: {
      protocol: 'ws', 
      host: 'localhost', // Pode ajustar isso para o seu host se necessário
      port: 3001, // A mesma porta definida acima
    },
  },
});
