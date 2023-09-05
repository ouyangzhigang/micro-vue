import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import qiankun from 'vite-plugin-qiankun'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import viteImagemin from 'vite-plugin-imagemin'
import Icons from 'unplugin-icons/vite'
import Commonjs from '@rollup/plugin-commonjs'
import { VitePWA } from 'vite-plugin-pwa'

import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  assetsInclude: ['**/*.svg'],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve('src/assets/variables.less')}";`
        },
        math: 'strict',
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    AutoImport({
      resolvers: [
        TDesignResolver({
          library: 'vue-next'
        })
      ]
    }),
    Components({
      resolvers: [
        TDesignResolver({
          library: 'vue-next'
        })
      ]
    }),
    qiankun(pkg.name, {
      useDevMode: true
    }),
    vue({
      template: {
        compilerOptions: {
          // i am ignorning my custom '<container>' tag
          isCustomElement: tag => ['container'].includes(tag)
        }
      }
    }),
    vueJsx(),
    // splitVendorChunkPlugin(),
    // cssImportPlugin()
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    Icons({ autoInstall: true, compiler: 'vue3' }),
    VitePWA({ registerType: 'autoUpdate', injectRegister: 'auto' })
  ],
  pluginOptions: {},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    origin: '//localhost:3000',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },

    // 是否开启 https
    https: false,
    // 端口号
    port: 3000,
    // 监听所有地址
    host: '0.0.0.0',
    // 服务启动时是否自动打开浏览器
    open: false,
    // 允许跨域
    cors: true,
    // 自定义代理规则
    proxy: {}
  },
  preview: {
    port: 30000
  },
  build: {
    // 设置最终构建的浏览器兼容目标
    // target: 'es2015',
    // 构建后是否生成 source map 文件
    sourcemap: ['development', 'test'].includes(mode),
    //  chunk 大小警告的限制（以 kbs 为单位）
    chunkSizeWarningLimit: 244,
    // 启用/禁用 gzip 压缩大小报告
    reportCompressedSize: false,
    outDir: 'dist/prod',
    emptyOutDir: 'prod',
    minify: 'terser',
    // assetsInlineLimit
    // commonjsOptions: { include: ['src/utils'] },
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        // eslint-disable-next-line consistent-return
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 让每个插件都打包成独立的文件
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      },
      plugins: [Commonjs() as any]
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}))
