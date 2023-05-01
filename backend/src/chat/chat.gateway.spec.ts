import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { GatewaySessionManager } from './gateway.session';
import { ConversationService } from './Queries/conversation.service';
import { MessageService } from './Queries/message.service';
import { ParticipantService } from './Queries/participant.service';
import { PrismaService } from '../database/prisma.service';
import { INestApplication } from '@nestjs/common';
import * as WebSocket from 'ws';
import { expect } from 'chai';
import { WsAdapter } from '@nestjs/platform-ws'

async function createNestApp(...gateways): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  const app = testingModule.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app) as any);
  return app;
}

describe('ChatGateway', () => {
  let ws, app;

  beforeEach(async () => {
    app = await createNestApp(ChatGateway /*, other services and dependencies */);
    await app.listen(3000);

    ws = new WebSocket('ws://localhost:8001');
    await new Promise(resolve => ws.on('open', resolve));

    // Authenticate the client by sending a valid token
    ws.send('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJjMjE1ODZjLTA4ZTMtNDExMi04OGQ5LTYwMTgxNjVlNjdmOSIsImxvZ2luIjoidXNlcjEiLCJpYXQiOjE2ODI2MTExNzcsImV4cCI6MTY4Mjg3MDM3N30.i_UkOkZH84fyQaTI7YBn-Wmg6M6Zf28zcW-dV9gtegI');
    await new Promise(resolve => ws.on('message', resolve));
  });

  it('should create a conversation', async () => {
    ws.send(
      JSON.stringify({
        event: 'createConversation',
        data: {
          title: 'Test conversation',
          // ... other required fields
        },
      }),
    );
    await new Promise<void>(resolve =>
      ws.on('message', data => {
        const response = JSON.parse(data);
        expect(response.event).to.equal('conversationCreated');
        expect(response.data.title).to.equal('Test conversation');
        ws.close();
        resolve();
      }),
    );
  });

  it('should join a conversation', async () => {
    // Create a conversation or use an existing one to join

    ws.send(
      JSON.stringify({
        event: 'joinConversation',
        data: {
          conversationID: 'conversation-id-to-join',
        },
      }),
    );
    await new Promise<void>(resolve =>
      ws.on('message', data => {
        const response = JSON.parse(data);
        expect(response.event).to.equal('conversationJoined');
        expect(response.data.conversationID).to.equal('conversation-id-to-join');
        ws.close();
        resolve();
      }),
    );
  });

  afterEach(async () => {
    if (app)
      await app.close();
  });
});
