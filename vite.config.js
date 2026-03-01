import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json' with { type: 'json' }

// https://vite.dev/config/
const repoName = globalThis.process?.env?.GITHUB_REPOSITORY?.split('/')[1] ?? pkg.name

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  base: command === 'build' ? `/${repoName}/` : '/',
}))
