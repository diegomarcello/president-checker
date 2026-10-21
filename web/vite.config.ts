import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'

// Same security headers that vercel.json applies in production, so previews behave alike.
const securityHeaders: Record<string, string> = Object.fromEntries(
  (
    JSON.parse(readFileSync(path.resolve(import.meta.dirname, 'vercel.json'), 'utf8')).headers[0].headers as {
      key: string
      value: string
    }[]
  ).map((h) => [h.key, h.value]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: { headers: securityHeaders },
  build: { sourcemap: false },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
