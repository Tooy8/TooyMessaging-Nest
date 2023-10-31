//验证策略，也就是验证前端请求头中携带的token
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

export interface JwtPayload {
  username: string;
}

@Injectable()
// 验证请求头中的token
export default class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  //用于验证 JWT 的有效性并返回解码后的有效载荷数据。
  async validate(payload: JwtPayload) {
    const { username } = payload;
    return {
      username,
    };
  }
}
