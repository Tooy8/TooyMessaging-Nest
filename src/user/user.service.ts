import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
@Injectable()
export class UserService {
  //模型注入
  constructor(@InjectModel(User) private userModel: typeof User) {}
  async create(createUserDto: CreateUserDto) {
    // 根据传入的 createUserDto 中的属性进行初始化。
    let res = await this.userModel.build({
      ...createUserDto,
    });
    await res.save();
    return res;
  }
  //查找全部
  async findAll() {
    let res = await this.userModel.findAll();
    return res;
  }
  async find(createUserDto: CreateUserDto) {
    let res = await this.userModel.findOne({
      // where 字段用于指定查询条件
      where: {
        ...createUserDto,
      },
    });
    return res;
  }
  //根据名字查找
  async findOne(username: string) {
    let res = await this.userModel.findOne({
      where: {
        username,
      },
    });
    return res !== null ? res : null;
  }
  //上传头像
  async uploadAvatar(username: string, avatar: string) {
    let res = await this.userModel.update(
      {
        avatar,
      },
      {
        where: {
          username: username,
        },
      },
    );
    return {
      code: '200',
      msg: '上传成功',
      data: res,
    };
  }
  // 判断是否有头像
  async hasAvatar(username: string) {
    let res = await this.userModel.findOne({
      where: {
        username: username,
      },
    });
    return res.avatar !== null;
  }
}
