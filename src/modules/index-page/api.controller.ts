// import { Controller, Get, Post, HttpCode, Body } from '@nestjs/common'
// import { ApiService } from './index.service'

// @Controller('/api')
// export class ApiController {
// 	constructor(private readonly apiService: ApiService) { }

// 	@Get('/index')
// 	async getIndexData(params: any): Promise<any> {
// 		return await this.apiService.severInitData(params)
// 	}
	
// 	@Post('/sendEmail')
// 	@HttpCode(200)
// 	create(@Body() postData: any) {
// 		return {
// 			code: 0,
// 			message: `Message sent:`
// 		}
// 	}
// }
