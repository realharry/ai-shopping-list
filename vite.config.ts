import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          if (facadeModuleId.includes('background')) {
            return 'background.js';
          } else if (facadeModuleId.includes('content')) {
            return 'content.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: (chunkInfo) => {
          // Keep content script chunks inline to avoid module loading issues
          const facadeModuleId = chunkInfo.facadeModuleId || '';
          if (facadeModuleId.includes('content')) {
            return 'content-chunks-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // Ensure assets use relative paths for Chrome extension
  base: './',
})
