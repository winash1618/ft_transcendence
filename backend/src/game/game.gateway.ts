import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { GameEngine } from './game.engine';
import {
  SocketData,
  UserMap,
  GameStatus,
  Game,
  KeyPress,
  InvitationMap,
} from './interface/game.interface';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid4 } from 'uuid';
import { CreateGameDto } from './dto/create-game.dto';

@WebSocketGateway(8001, {
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private gameRooms: GameEngine[] = [];
  private users: SocketData[] = [];
  private invitedUser: InvitationMap = new Map<string, SocketData[]>();
  private userSockets: UserMap = new Map<string, SocketData>();

  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const userid = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    console.log('User connected: ', userid);
    client.data.userID = userid;

    this.setUserStatus(client, GameStatus.WAITING);
  }

  handleDisconnect(client: any) {
    const token = client.handshake.auth.token;
    const userid = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    console.log('User disconnected: ', userid);
    this.users = this.users.filter(user => user.userID === userid);
    this.userSockets.delete(userid);
  }

  createGameRoom(player1: SocketData, player2: SocketData) {
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
        status: status,
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

    if (
      this.users.find(user => user.userID['id'] === socketData.userID['id'])
    ) {
      this.server.to(client.id).emit('error');
      return;
    }

    if (this.users.length >= 1) {
      this.users[0].playerNumber = 1;
      this.users[0].status = GameStatus.READY;
      socketData.playerNumber = 2;
      socketData.status = GameStatus.READY;
      const roomID = this.createGameRoom(this.users[0], socketData);
      this.users[0].gameID = roomID;
      socketData.gameID = roomID;
      this.server.to(client.id).emit('start', {
        playerNo: 2,
        roomID,
      });
      this.server.to(this.users[0].client.id).emit('start', {
        playerNo: 1,
        roomID,
      });
      this.users.splice(0, 1);
    } else {
      socketData.status = GameStatus.READY;
      this.users.push(socketData);
    }
  }

  @SubscribeMessage('Invite')
  inviteUser(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const userID = client.data.userID;
    const invitedUserID = data;
    const socketData: SocketData = this.setUserStatus(
      client,
      GameStatus.WAITING,
    );
    if (this.userSockets.has(invitedUserID)) {
      const invitedSocketData = this.userSockets.get(invitedUserID);
      if (invitedSocketData.status === GameStatus.WAITING) {
        this.invitedUser.set(invitedUserID, [socketData, invitedSocketData]);
        this.server.to(client.id).emit('Invited', invitedUserID);
        this.server.to(invitedSocketData.client.id).emit('Invited', userID);
      }
    }
  }

  @SubscribeMessage('Accept')
  acceptInvitation(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const userID = client.data.userID;
    const invitedUserID = data;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.READY);
    if (this.invitedUser.has(invitedUserID)) {
      const invitedSocketData = this.invitedUser.get(invitedUserID)[1];
      if (invitedSocketData.userID === userID) {
        const roomID = this.createGameRoom(socketData, invitedSocketData);
        socketData.gameID = roomID;
        invitedSocketData.gameID = roomID;
        this.server.to(client.id).emit('GameCreated', roomID);
        this.server.to(invitedSocketData.client.id).emit('GameCreated', roomID);
        this.invitedUser.delete(invitedUserID);
      }
    }
  }

  @SubscribeMessage('JoinGame')
  joinGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const roomID = data;
    const userID = client.data.userID;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.READY);

    if (!this.gameRooms[roomID]) {
      console.log('disconnected');
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
      gameRoom: gameRoom.gameObj,
    });
  }

  @SubscribeMessage('move')
  handleMove(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const roomId = data.roomID;
    const keyStatus: KeyPress = data.key;
    const isPressed = data.isPressed;
    if (roomId in this.gameRooms)
      this.gameRooms[roomId].barSelect(keyStatus, client, isPressed);
  }

  @SubscribeMessage('StartGame')
  async startGame(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    const roomID = data;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.READY);

    if (!this.gameRooms[roomID]) {
      console.log('disconnected');
      client.disconnect();
      return;
    }
    if (socketData.status === GameStatus.READY) {
      if (socketData.gameID === roomID) {
        client.join(roomID);
      }
    }
    if (this.gameRooms[roomID]) {
      this.gameRooms[roomID].startGame();
    }
    // const gameDTO: CreateGameDto = {
    //   player_one: this.gameRooms[roomID].gameObj.player1.name,
    //   player_two: this.gameRooms[roomID].gameObj.player2.name,
    //   player_score: this.gameRooms[roomID].gameObj.player1.points,
    //   opponent_score: this.gameRooms[roomID].gameObj.player2.points,
    //   winner: '',
    //   looser: '',
    // }
    // console.log(gameDTO);
    // await this.gameService.storeGameHistory(gameDTO);
  }
}
