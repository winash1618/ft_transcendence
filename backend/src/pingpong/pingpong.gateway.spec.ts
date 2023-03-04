import { Test, TestingModule } from '@nestjs/testing';
import { PingpongGateway } from './pingpong.gateway';

describe('PingpongGateway', () => {
  let gateway: PingpongGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PingpongGateway],
    }).compile();

    gateway = module.get<PingpongGateway>(PingpongGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
