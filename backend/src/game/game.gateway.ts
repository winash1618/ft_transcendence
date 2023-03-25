import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { GameService } from './game.service';
import { GameEngine } from './game.engine';
import { SocketData, UserMap, GameStatus, Game } from './interface/game.interface';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid4 } from 'uuid';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private gameRooms: GameEngine[] = [];
  private users: SocketData[] = [ ]
  private userSockets: UserMap = new Map<string, SocketData>();

  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,

    ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const userid = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET
    });

    client.data.userID = userid;
  }

  handleDisconnect(client: any) {
    const token = client.handshake.auth.token;
    const userid = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET
    });
    console.log('User disconnected: ', userid);
    this.users = this.users.filter(user => user.userID !== userid);
    this.userSockets.delete(userid);
  }

  createGameRoom(
    player1: SocketData,
    player2: SocketData
  ) {
    const id = uuid4();
    const game: Game = {
      gameID: id,
      player1: player1.userID,
      player2: player2.userID,
      player1Score: 0,
      player2Score: 0,
    };
    const gameRoom = new GameEngine(game, this.server, player1, player2);
    gameRoom.startSettings();
    this.gameRooms[id] = gameRoom;
    return id;
  }

  setUserStatus(client: Socket, status: GameStatus) {
    const userID = client.data.userID;
    if (!this.userSockets.has(userID)) {
      const socketData: SocketData = {
        playerNumber: -1,
        client: client,
        gameID: '',
        userID: userID,
        status: status
      };
      this.userSockets.set(userID, socketData);
      return socketData;
    }
    const socketData = this.userSockets.get(userID);
    socketData.status = status;
    return socketData;

  }

  @SubscribeMessage('Register')
  async registerUser(@ConnectedSocket() client: Socket) {
    let socketData: SocketData = this.setUserStatus(client, GameStatus.WAITING);

    if (this.users.length >= 1) {
      this.users[0].playerNumber = 1;
      this.users[0].status = GameStatus.READY;
      socketData.playerNumber = 2;
      socketData.status = GameStatus.READY;
      const roomID = this.createGameRoom(this.users[0], socketData);
      this.users[0].gameID = roomID;
      socketData.gameID = roomID;
      this.server.to(client.id).emit('GameCreated', roomID);
      this.server.to(this.users[0].client.id).emit('GameCreated', roomID);
    }
    else {
      socketData.status = GameStatus.READY;
      this.users.push(socketData);
    }
  }

  @SubscribeMessage('JoinGame')
  joinGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const roomID = data.roomID;
    const userID = client.data.userID;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.READY);

    if (!this.gameRooms[roomID]) {
      client.disconnect();
      return;
    }
    const gameRoom = this.gameRooms[roomID];
    if (socketData.status === GameStatus.READY) {
      if (socketData.gameID == roomID) {
        client.join(roomID);
      }
    }
    this.server.to(client.id).emit('GameJoined', {
      playerNumber: socketData.playerNumber,
      gameRoom: gameRoom.gameObj
    });
  }

  @SubscribeMessage('StartGame')
  startGame(@MessageBody() data: any) {
    const roomId = data.roomID;
    if (this.gameRooms[roomId]) {
      this.gameRooms[roomId].startGame();
    }
  }
}
