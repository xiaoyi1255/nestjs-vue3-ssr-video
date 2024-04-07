import type { UserConfig } from 'ssr-types'

const userConfig: UserConfig = {
  serverPort: 8080,
  host: '0.0.0.0',
  proxy: {
    // '/api': {
    //   target: 'https://h5.yowin.tech',
    //   changeOrigin: true,
    // },
    '/package': {
      target: 'https://static-us.tick.video',
      // target: 'https://activity.yowin.tech',
      changeOrigin: true,
      pathRewrite: {
        '^/package': '', // 如果后端API的路径不是以 '/api' 开头，可修改为其他路径
      },
    }
  },
  css: () => {
    // const tailwindcss = require('tailwindcss')
    // const autoprefixer = require('autoprefixer')
    // return {
    //   loaderOptions: {
    //     postcss: {
    //       plugins: [
    //         tailwindcss,
    //         autoprefixer
    //       ]
    //     }
    //   }
    // }
    return {}
  },
  // babelOptions: {
  //   plugins: [
  //     ['import', {
  //       libraryName: 'swiper',
  //       libraryDirectory: 'vue/',
  //       style: false
  //     }, 'swiper']
  //   ] // 通常使用该配置新增 plugin
  // },
  customeHeadScript:[
    // {
    //   describe: {
    //       type: 'text/javascript',
    //       src: '/js/version.js'
    //   },
    //   content: ''
    // },
    // {
    //   describe: {
    //       type: 'text/javascript',
    //       src: '/js/bsdk.js'
    //   },
    //   content: ''
    // },
  ]
}

export { userConfig }
