import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from './user/model/user.model';
import { AuthService } from './auth/auth.service';
@Injectable()
export class AppService {
// 依赖注入
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private authService: AuthService
  ) { }
//注册
  async register(user) {
    // 加密密码
    const hash = await bcrypt.hash(user.password, 10)
    // 根据username匹配数据库
    const isNotExist = await this.userModel.findOne({
      where: {
        username: user.username
      }
    })
    // 新用户
    if (!isNotExist) {
      //创建模型对象
      const res = await this.userModel.build(
        {
          username: user.username,
          password: hash,
          avatar: user.avatar,
        }
      )
      //将模型对象保存到数据库
      await res.save()
      return {
        code: '200',
        msg: "用户注册成功",
      }
    } else {
      return {
        code: '1001',
        msg: '该用户已经存在'
      }
    }
  }
  //登录
  async login(loginParmas) {
    // 调用authService
    const authResult = await this.authService.validateUser(loginParmas.username, loginParmas.password);
    //验证是否是有效用户
    if (authResult) {
      return this.authService.login(authResult)
    } else {
      return {
        code: '1002',
        msg: "请检查用户名或密码是否正确"
      }
    }
  }

}
