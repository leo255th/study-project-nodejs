import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
/**
 * 测试生成jwt
 * @param dto 传入的请求体
 * @returns 返回生成的token
 */
  @Post('jwt-generate')
  jwtGenerate(
    @Body()dto:{
      user:string,
      url:string
    }
  ):Promise<{
    accessToken: string,
    refreshToken: string
  }>{
    return this.appService.jwtGenerate(dto);
  }
  @Post('jwt-verify')
  jwtVerify(
    @Body()dto:{
      accessToken:string,
      refreshToken:string
    }
  ):Promise<{
    res:boolean,
    accessToken?:string,
    refreshToken?:String
  }>{
    return this.appService.jwtVerify(dto);
  }
}
