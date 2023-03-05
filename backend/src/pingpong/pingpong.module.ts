import { Module } from '@nestjs/common';
import { PingpongGateway } from './pingpong.gateway';
import { PingpongService } from './pingpong.service';

@Module({
  providers: [PingpongService, PingpongGateway]
})
export class PingpongModule {}
