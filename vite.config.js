import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import seoPlugin from './seo.plugin.js'
import metaGlobePlugin from './meta-globe.plugin.js'

const r = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seoPlugin(env, mode), metaGlobePlugin()],
    resolve: {
      // Rolldown can bundle these twice (two module copies = broken hooks/context at runtime)
      dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
      alias: {
        '@': r('./src'),
        '@lib': r('./lib'),
        '@turtle-ui': r('./lib/turtle-ui'),
      },
    },
  }
})
