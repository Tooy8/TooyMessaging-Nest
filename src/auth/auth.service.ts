import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
    //依赖注入
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    //验证用户
    async validateUser(username: string, pass: string): Promise<any> {
        //查询数据库中是否存在该用户名对应的用户记录。
        const user = await this.userService.findOne(username);
        if (user) {
            //使用 bcrypt.compare 方法来比较传入的密码 pass 和从数据库中查询到的用户记录的密码是否匹配。
            const passwordCompare = await bcrypt.compare(pass, user.password)
            if (user && passwordCompare) {
                const { password, ...result } = user;
                return result;
            }
            return null
        } else {
            return null
       }
    }
    //登录
    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            code: '200',
            //使用 this.jwtService.sign(payload) 方法   对 payload 对象进行签名，生成一个带有密钥的 JWT
            access_token: this.jwtService.sign(payload),
            msg:'登录成功'
        };
    }

}