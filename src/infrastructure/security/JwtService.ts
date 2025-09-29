import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class JwtService {
  static generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  static verifyToken<T = any>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  }
}
