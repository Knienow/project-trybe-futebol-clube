import * as jwt from 'jsonwebtoken';
// import { JwtPayload, Secret, sign, SignOptions, verify } from 'jsonwebtoken';
export default class JWT {
  private static secret: jwt.Secret = process.env.JWT_SECRET || '';

  private static jwtConfig: jwt.SignOptions = {
    expiresIn: '10d',
    algorithm: 'HS256',
  };

  static sign(payload: jwt.JwtPayload): string {
    return jwt.sign({ ...payload }, this.secret, this.jwtConfig);
  }

  static verify(token: string): jwt.JwtPayload | string {
    return jwt.verify(token, this.secret) as jwt.JwtPayload;
  }
}
