import { Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
//类被绑定到 WebSocketGateway，并且将监听在端口号 2999 上。
@WebSocketGateway(2999, {
  //用于设置跨域资源共享（CORS）策略。在这里，origin: '*' 表示允许来自任何来源的跨域请求。
  cors: {
    origin: '*',
  },
})
@Injectable()
export class EventsGateway {
  //使用 @WebSocketGateway() 装饰器将类声明为 WebSocket 服务器的网关，使用 @WebSocketServer() 装饰器获取 Socket.IO 服务器实例，并将其赋值给 server 属性。
  @WebSocketServer()
  server: Server;

  //引入map
  constructor(@Inject('MyMap') private readonly myMap: Map<string, any>) {}
  //登录时进入房间
  @SubscribeMessage('connection')
  t(
    @MessageBody()
    data: {
      username: string;
    },
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    //在客户端连接成功后 ,向客户端发送 ‘join’ 事件  ,将客户端加入一个名为 data.username 的房间。
    client.emit('join', async (client) => {
      client.join(data.username);
    });
    //服务端向客户端发出了一个自定义的 ‘join’ 事件。
    return { event: 'join', data: '服务端推送到客户端' };
  }

  //发送消息时触发
  @SubscribeMessage('sendMessage')
  sendMessage(
    @MessageBody()
    data: {
      to: string;
    },
    @ConnectedSocket() client: Socket,
  ): WsResponse<unknown> {
    //向除当前客户端之外的所有客户端广播发送一个名为 ‘showMessage’ 的事件。
    client.broadcast.emit('showMessage');
    //向当前客户端发送一个名为 ‘showMessage’ 的事件。
    client.emit('showMessage');
    return;
  }

  // 创建加入房间
  @SubscribeMessage('changeRoom')
  changeRoom(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): void {
    // 处理聊天消息
    const { type, roomId, name } = payload || {};

    payload['users'] = '';
    payload['code'] = 200;

    payload = {
      ...payload,
      text: 123,
    };
    //  const roomMap = new Map();
    const room = this.myMap.get(roomId);

    if (type == 'create') {
      if (!room) {
        const roomInfo = {
          roomId,
          createUser: name,
          // serverTime: new Date().getTime(),
          userList: [{ name, jionTime: +new Date() }],
        };
        this.myMap.set(roomId, roomInfo);
        payload = {
          ...payload,
          text: '您已加入房间！！！',
          code: 200,
        };
      } else {
        // 房间号已存在
        payload = {
          ...payload,
          text: '房间号已存在',
          code: 501,
        };
      }
    } else if (type == 'join') {
      // 加入房间
      if (!room) {
        payload = {
          ...payload,
          text: '房间号不存在',
          code: 502,
        };
      } else {
        const existingUser = room.userList.find((user) => user.name === name);
        if (!existingUser) {
          room.userList.push({ name, jionTime: +new Date() });
        }
        payload = {
          ...payload,
          text: name + '已进入房间',
          code: 200,
        };
      }
    } else if (type == 'leave') {
      if (Array.isArray(room.userList) && room.userList.length) {
        const index = room.userList.findIndex((item) => item.name === name);
        index != -1 && room.userList.splice(index, 1);

        payload = {
          ...payload,
          text: name + '离开了房间',
        };
        if (this.myMap.get(roomId)?.userList?.length == 0) {
          this.myMap.delete(roomId);
        }
      }
    }
    // 房间人数
    payload['users'] = this.myMap.get(roomId)?.userList?.length || 0;
    this.server.emit('message', payload);
  }
}
