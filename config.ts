import type { UserConfig } from 'ssr-types'

const userConfig: UserConfig = {
  serverPort: 8888,
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
}

export { userConfig }
