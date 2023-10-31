import { ApiProperty } from '@nestjs/swagger';
//类验证器
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    default: 'boyyang',
    description: '创建用户姓名',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'haoshuai',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    // default: 'https://api.multiavatar.com/Binx',
    default: '',
  })
  avatar: string;
}
