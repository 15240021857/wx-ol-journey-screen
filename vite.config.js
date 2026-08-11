import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import viteCompression from 'vite-plugin-compression'

const tsconfig = JSON.parse(readFileSync(resolve(__dirname, 'tsconfig.json'), 'utf-8'))
const aliases = {}
if (tsconfig.compilerOptions.paths) {
  Object.keys(tsconfig.compilerOptions.paths).forEach(key => {
    const path = tsconfig.compilerOptions.paths[key][0]
    aliases[key.replace('/*', '')] = fileURLToPath(new URL(path.replace('/*', ''), import.meta.url))
  })
}

export default defineConfig({
  base: '/wx-ol-journey-screen/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts'
    }),
    // 压缩，打包后删除原文件
    viteCompression({
      algorithm: ['gzip', 'brotli'],
      ext: '.gz, .br,'
      // deleteOriginFile: true
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue', '.d.ts']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/style/variables.scss" as *;`
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          ol: ['ol'],
          echarts: ['echarts'],
          'element-plus': ['element-plus']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
    hot: true,
    open: true,
    proxy: {
      // '/weather': {
      //   target: 'https://n45n8brn7u.re.qweatherapi.com',
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: path => path.replace(/^\/weather/, ''),
      //   configure: proxy => {
      //     proxy.on('proxyReq', (proxyReq, req) => {
      //       if (req.headers.authorization) {
      //         proxyReq.setHeader('Authorization', req.headers.authorization)
      //       }
      //     })
      //   }
      // }
    }
  }
})
