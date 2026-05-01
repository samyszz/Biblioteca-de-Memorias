import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Se o log indicar um módulo específico, adicione-o aqui.
      // Exemplo: external: ['nome-do-modulo']
    }
  }
})