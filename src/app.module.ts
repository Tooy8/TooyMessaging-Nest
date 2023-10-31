import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/model/user.model';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EventsModule } from './ws/event.module';
import { MessageModule } from './message/message.module';
import { Message } from './message/model/message.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin123',
      database: 'nest',
      models: [User],
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([User, Message]),
    UserModule,
    AuthModule,
    EventsModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    // 注册为全局守卫
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
