import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { io } from 'socket.io-client';
import { JwtService } from '@nestjs/jwt';
import { GatewaySessionManager } from './gateway.session';
import { UsersService } from '../users/users.service';
import { ConversationService } from './Queries/conversation.service';
import { MessageService } from './Queries/message.service';
import { ParticipantService } from './Queries/participant.service';
import { PrismaService } from '../database/prisma.service';
import { INestApplication } from '@nestjs/common';

async function createNestApp(...gateways): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = testingModule.createNestApplication();
  return app;
}

describe('WebSocketGateway', () => {
  let ws, app;

  it(`should handle message (2nd port)`, async () => {
    app = await createNestApp(ChatGateway);
    await app.listen(8000);

    ws = io('http://localhost:3001');
    ws.emit('push', {
      test: 'test',
    });
    await new Promise<void>(resolve =>
      ws.on('pop', data => {
        expect(data.test).to.be.eql('test');
        resolve();
      }),
    );
  });

  it(`should handle message (http)`, async () => {
    app = await createNestApp(ServerGateway);
    await app.listen(3000);

    ws = io('http://localhost:3000');
    ws.emit('push', {
      test: 'test',
    });
    await new Promise<void>(resolve =>
      ws.on('pop', data => {
        expect(data.test).to.be.eql('test');
        resolve();
      }),
    );
  });

  it(`should handle message (2 gateways)`, async () => {
    app = await createNestApp(ApplicationGateway, NamespaceGateway);
    await app.listen(3000);

    ws = io('http://localhost:8080');
    io('http://localhost:8080/test').emit('push', {});
    ws.emit('push', {
      test: 'test',
    });
    await new Promise<void>(resolve =>
      ws.on('pop', data => {
        expect(data.test).to.be.eql('test');
        resolve();
      }),
    );
  });

  afterEach(() => app.close());
});
