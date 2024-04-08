import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { initialSSRDevProxy, loadConfig, getCwd } from 'ssr-server-utils'
import { AppModule } from './app.module'


async function bootstrap (): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  await initialSSRDevProxy(app, {
    express: true
  })
  app.useStaticAssets(join(getCwd(), './build'))
  app.useStaticAssets(join(getCwd(), './build/client'))
  app.useStaticAssets(join(getCwd(), './public'))
  const { serverPort } = loadConfig()
  console.log(serverPort, 'serverPort===')
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  await app.listen(serverPort)

}


bootstrap().catch(err => {
  console.log(err)
  process.exit(1)
})
