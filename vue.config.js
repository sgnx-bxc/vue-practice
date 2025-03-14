const UselessFile = require('useless-files-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const timeStamp = new Date().getTime()
const webpack = require('webpack')
module.exports = {
  publicPath: '/',
  outputDir: 'my-web-dist',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api/': {
        // target: 'http://10.45.116.40:8000', // jicheng
        // target: 'http://10.45.111.26:8000', // jicheng
        target: 'http://10.45.116.209:8000', // jicheng
        // target: 'http://10.45.111.48:8000', // jicheng
        // target: 'http://192.168.2.93:8000', // jicheng
        // target: 'http://10.45.111.26:8000', // jicheng
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api/': '/'
        }
      },
      '/api2/': {
        target: 'http://10.45.116.209:8012', // jicheng
        ws: false,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api2/': '/'
        }
      }
    }
  },
  chainWebpack: (config) => {
    // 查找没用的文件
    config.plugin('uselessFile').use(
      new UselessFile({
        root: path.resolve(__dirname, './src'), // 项目目录
        out: './fileList.json', // 输出文件列表
        clean: false, // 是否删除文件,
        exclude: /node_modules/ // 排除文件列表
      })
    )
    // 添加时间戳参数
    config.plugin('html').tap((args) => {
      args[0].createTime = timeStamp
      return args
    })
    // 引入全局less变量文件
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach((type) =>
      config.module
        .rule('less')
        .oneOf(type)
        .use('style-resources')
        .loader('style-resources-loader')
        .options({
          patterns: [path.resolve(__dirname, './src/style/variable.less')]
        })
    )
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('preload') // 删除预加载
      config.plugins.delete('prefetch') // 删除预加载
      config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap((options) =>
          Object.assign(options, {
            limit: 10240 // 小于10k，压缩图片转为base64，大于10k不处理
          })
        )
      // 输出重构打包编译后的css文件名称
      config.plugin('extract-css').tap(() => [
        {
          filename: `css/[name].[contenthash].css?t=${timeStamp}`,
          chunkFilename: `css/[name].[contenthash].css?t=${timeStamp}`
        }
      ])
    }
  },
  configureWebpack: {
    performance: {
      hints: false
    },
    module: {
      // 减少不必要的解析
      noParse: /^(vue|vue-router|vuex|vuex-router-sync|lodash|moment)$/
    },
    output: {
      // 输出重构打包编译后的js文件名称
      filename: `js/[name].[hash].js?t=${timeStamp}`,
      chunkFilename: `js/[name].[contenthash].js?t=${timeStamp}`
    },
    optimization: {
      // 代码抽离分包
      splitChunks: {
        cacheGroups: {
          mockModules: {
            name: 'chunk-mock-modules',
            test: /[\\/]src[\\/]mock[\\/]modules/,
            priority: 0,
            chunks: 'all',
            enforce: true
          },
          echarts: {
            name: 'chunk-echarts',
            test: /[\\/]node_modules[\\/]echarts/,
            priority: 0,
            chunks: 'all',
            enforce: true
          },
          elementUI: {
            name: 'chunk-elementUI',
            test: /[\\/]node_modules[\\/]element-ui/,
            priority: 0,
            chunks: 'all',
            enforce: true
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      },
      // 移除console.log
      minimizer: [
        new TerserPlugin({
					parallel: 4, // 使用多进程并发运行以提高构建速度
          terserOptions: {
            output: {
              comments: false // 删除注释
            },
            compress: {
              drop_debugger: true, // 删除debugger
              drop_console: true, // 删除console
              pure_funcs: ['console.log'] // 删除console.log
            }
          }
        })
      ]
    },
    plugins: [
      // 设置打包规则
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
    ]
  }
}
