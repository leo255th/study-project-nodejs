import * as fs from 'fs'
import * as path from 'path'
import * as jwt from 'jsonwebtoken'
import { join } from 'path';

const PRIVATE_KEY = fs.readFileSync(path.resolve(join(__dirname, '../../resources/ecc-private-key.pem')));
const PUBLIC_KEY = fs.readFileSync(path.resolve(join(__dirname, '../../resources/ecc-public-key.pem')));

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
export async function tokenVerify(token: {
  accessToken: string,
  refreshToken: string
}): Promise<{ res: boolean, accessToken?: string, refreshToken?: string }> {

  return new Promise<{ res: boolean, accessToken?: string, refreshToken?: string }>((resolve, reject) => {
    jwt.verify(token.accessToken, PUBLIC_KEY, { algorithms: ['ES256'] }, (err, decode) => {
      if (!err) {
        // 验证通过
        resolve({
          res: true,
        })
      } else if (err.name = 'TokenExpiredError') {
        // token过期，验证refreshToken
        try {
          jwt.verify(token.refreshToken, PUBLIC_KEY, { algorithms: ['ES256'] });
          // 验证通过
          console.log('原来的decode:', decode)
          const { accessToken, refreshToken } = tokenGenerate(decode);
          resolve({
            res: true,
            accessToken,
            refreshToken
          })
        }
        catch (err) {
          // refreshToken验证不通过
          resolve({
            res: false
          })
        }
      }

    });

  })
}
