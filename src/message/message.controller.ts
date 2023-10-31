import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { findMessageListDTO } from './dto/find-messageList.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/public.decorator';

@ApiTags('消息')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //发送消息
  @Public()
  @Post('send')
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }

  // 查询
  @Public()
  @Post('list')
  async findAll(@Body() findMessageListDTO: findMessageListDTO) {
    return await this.messageService.findMessageList(findMessageListDTO);
  }
}
