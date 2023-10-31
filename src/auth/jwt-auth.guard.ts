//用于全局守卫，将未携带token的接口进行拦截
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/public.decorator';

@Injectable()
//自定义的身份验证守卫
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //获取带有 IS_PUBLIC_KEY 元数据的值
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 如果其值为 true，则说明该路由或控制器被标记为公开的（使用了 @Public 装饰器），直接返回 true，即允许访问。
    if (isPublic) return true;
    //其值不为 true，则调用父类的 canActivate 方法，执行默认的身份验证逻辑。
    return super.canActivate(context);
  }
}
