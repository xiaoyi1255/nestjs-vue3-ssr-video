import { Injectable } from '@nestjs/common'
import mock from './index.mock'

@Injectable()
export class ApiService {
  async severInitData (params: any): Promise<any> {
    return await Promise.resolve(mock)
  }
}
