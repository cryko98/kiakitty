import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // @ts-ignore process is available in the node build environment
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // @ts-ignore process is injected by vite
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      rollupOptions: {
        external: ['@google/genai']
      }
    },
    optimizeDeps: {
      exclude: ['@google/genai']
    }
  }
})