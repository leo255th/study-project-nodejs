import * as fs from 'fs'
import * as path from 'path'
import * as jwt from 'jsonwebtoken'

const PRIVATE_KEY = fs.readFileSync(path.resolve('../../resources/es256-pri.pem'));
const PUBLIC_KEY = fs.readFileSync(path.resolve('../../resources/es256-pub.pem'));

export function tokenGenerate(payload: {
  user: string,
  url: string
}): {
  accessToken: string,
  refreshToken: string
} {

  const accessToken = jwt.sign({
    data: JSON.stringify(payload),
    exp: Math.floor(Date.now() / 1000) + (60),  // 在这里设置过期的时间，单位：秒
  }, PRIVATE_KEY, { algorithm: 'ES256' });
  const refreshToken = jwt.sign({
    data: JSON.stringify(payload),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),  // 在这里设置过期的时间，要远远大于accessToken
  }, PRIVATE_KEY, { algorithm: 'ES256' });
  return {
    accessToken,
    refreshToken
  }

}
export function tokenVerify(token:{
  accessToken: string,
  refreshToken: string
}): { res: boolean, accessToken?: string, refreshToken?: string } {
  try {
    // 先验证accessToken
    const data: any = jwt.verify(token.accessToken, PUBLIC_KEY, { algorithms: ['ES256'] });
    return {
      res: true
    };
  } catch (e) {
    console.error(e);
    // 如果token过期，验证refreshToken，如果没过期，生成新的accessToken和resfreshToken
    return {
      res:false
    }
    
  }
}