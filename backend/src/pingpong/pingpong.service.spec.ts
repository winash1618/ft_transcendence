import { Test, TestingModule } from '@nestjs/testing';
import { PingpongService } from './pingpong.service';

describe('PingpongService', () => {
  let service: PingpongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingpongService],
    }).compile();

    service = module.get<PingpongService>(PingpongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
