import { Module } from '@nestjs/common';
import { EventsGateway } from './envent.gateway';
import { MapProvider } from './map.provider';
@Module({
  providers: [EventsGateway, MapProvider],
})
export class EventsModule {}
