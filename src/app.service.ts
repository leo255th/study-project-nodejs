import { Injectable } from '@nestjs/common';
import { tokenGenerate, tokenVerify } from './untils/jwt.func';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async jwtGenerate(dto: {
    user: string,
    url: string
  }): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    return await tokenGenerate(dto);
  }
  async jwtVerify(dto: {
    accessToken: string,
    refreshToken: string
  }): Promise<{
    res: boolean,
    accessToken?: string,
    refreshToken?: string
  }> {
    return await tokenVerify(dto);
  }
}
