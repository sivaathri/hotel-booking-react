import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/scss/variables.scss";`
      }
    }
  },
  build: {
    cssCodeSplit: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'bootstrap', 'antd', '@fortawesome/fontawesome-free']
        }
      }
    }
  }
})
