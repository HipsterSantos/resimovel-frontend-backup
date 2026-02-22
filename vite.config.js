import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Log environment variables for debugging (remove in production)
console.log('🔑 Environment Variables Loaded:');
console.log('VITE_GOOGLE_MAP_API_KEY:', process.env.VITE_GOOGLE_MAP_API_KEY ? '✅ Present' : '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV);

export default defineConfig({
  plugins: [react()],
  build:{
    chunkSizeWarningLimit: '5000',
    outDir: 'dist',
  },
  resolve:{
    alias:{
      '@svg':'/public/svg',
      '@img': '/public/img',
      '@fonts':'/public/fonts',
      '@@': '/src/components'

    }
  },
  // Ensure environment variables are available
  define: {
    'import.meta.env.VITE_GOOGLE_MAP_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_MAP_API_KEY),
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  }
})
