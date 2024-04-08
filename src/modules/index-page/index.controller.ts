import { Controller, Get, Req, Res, Query } from '@nestjs/common'
// import { Controller, Get, Req, Res,Post, HttpCode, Body } from '@nestjs/common'
import { Request, Response } from 'express'
import { render } from 'ssr-core-vue3'

import { ApiService } from './index.service'

interface QueryType { 
  uid: string; 
  userID: string; 
  gaid: string;
  unitID: string; 
  unitId: string; 
  did?: string;
  appKey: string;
  clientIP:string;
  clientIp: string;
  // unitType: string;
  // adType: string;
  // publisherID: string;
  // pubAppID: string;
 }

@Controller('/')
export class AppController {
  constructor (private readonly apiService: ApiService) {}

  @Get('/')
  async handlerIndex (@Req() req: Request, @Res() res: Response, @Query() query: QueryType): Promise<any> {
    try {

		const ctx = {
			request: req,
			response: res,
			apiService: this.apiService,
      serverTime: new Date().getTime(),
		}
		const stream = await render(ctx, {
			stream: true
		})
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.end()
      })
    } catch (error) {
      console.log(error)
      res.status(500).send(error)
    }
  }
}
