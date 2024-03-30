import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/Assets", replacement: "/src/assets" },
      { find: "@/Components", replacement: "/src/components" },
      { find: "@/Pages", replacement: "/src/pages" },
      { find: "@/Primitives", replacement: "/src/primitives" },
      { find: "@/Lib", replacement: "/src/lib" },
    ],
  },
})
