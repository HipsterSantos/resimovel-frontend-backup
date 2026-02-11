import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
// https://vitejs.dev/config/
dotenv.config()
export default defineConfig({
  plugins: [react()],
  build:{
    chunkSizeWarningLimit: '5000',
    outDir: 'build',
  },
  resolve:{
    alias:{
      '@svg':'/public/svg',
      '@img': '/public/img',
      '@fonts':'/public/fonts',
      '@@': '/src/components'

    }
  }
})
