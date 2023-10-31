//自定义装饰器
/* SetMetadata 是 NestJS 中的一个辅助函数，它用于设置元数据。在这里，我们将 IS_PUBLIC_KEY 设置为 true，
表示带有这个装饰器的路由或控制器是公开的。其他地方可以使用这个元数据来判断一个路由或控制器是否需要进行权限验证或身份验证。*/

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
