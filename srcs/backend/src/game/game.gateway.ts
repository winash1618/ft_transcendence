import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { GameEngine } from './game.engine';
import { ValidationPipe } from 'src/utils/WsValidationPipe.pipe';
import {
  SocketData,
  UserMap,
  GameStatus,
  KeyPress,
  UserInfo,
} from './interface/game.interface';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/Register.dto';
import { InviteDto } from './dto/Invite.dto';
import { AcceptDto } from './dto/Accept.dto';
import { RejectDto } from './dto/Reject.dto';
import { MoveDto } from './dto/Move.dto';
import { StartGameDto } from './dto/StartGame.dto';
import { UserStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { WebSocketConfig } from 'src/utils/ws-config';
import { MoveMobileDto } from './dto/moveMobile.dto';

@WebSocketGateway(8002, WebSocketConfig.getOptions(new ConfigService()))
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private gameRooms: GameEngine[] = [];
  private defaultQ: SocketData[] = [];
  private WallQ: SocketData[] = [];
  private userSockets: UserMap = new Map<UserInfo, SocketData>();

  constructor(
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const userid = this.verifyToken(client);
      if (!(await this.usersService.getUserById(userid['id'])))
        throw new Error('User not found');

      const users = Array.from(this.userSockets.keys());
      const foundUser = users.find(user => user.id === userid.id);
      const oldUser = this.userSockets.get(foundUser);
      if (oldUser) {
        console.log('User reconnected: ', userid);
        this.handleDisconnect(client);
      }

      const game = await this.gameService.checkIfGameRunning(userid.id);
      if (game) {
        client.join(game);
        this.gameRooms[game].usersAdd(userid, client, game);
      }

      client.data.userID = userid;
      const user = await this.usersService.findOne(client.data.userID['login']);
      client.data.userID['login'] = user.username;
      console.log('User connected: ', userid.login);

      this.setUserStatus(client, GameStatus.WAITING);
    } catch (e) {
      console.error('Error connecting to game gateway:', e.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    try {
      const userid = client.data.userID;
      console.log('User disconnected: ', userid.login);
      this.defaultQ = this.defaultQ.filter(
        (user: any) => user.userID.login !== userid.login,
      );
      this.WallQ = this.WallQ.filter(
        (user: any) => user.userID.login !== userid.login,
      );
      this.userSockets.delete(userid);
    } catch (e) {
      console.log('User disconnect: ', e.message);
    }
  }

  async createGameRoom(
    player1: SocketData,
    player2: SocketData,
    hasMiddleWall: boolean,
  ) {
    const game = await this.gameService.create({
      player_one: player1.userID.id,
      player_two: player2.userID.id,
      hasMiddleWall: hasMiddleWall,
      player_score: 0,
      opponent_score: 0,
      winner: null,
      looser: null,
    });
    const gameRoom = new GameEngine(
      game,
      this.server,
      player1,
      player2,
      this.gameService,
      hasMiddleWall,
    );
    this.gameRooms[game.id] = gameRoom;
    return game.id;
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
  async registerUser(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) data: RegisterDto,
  ) {
    try {
      console.log('In register');
      this.verifyToken(client);
      const player = this.userSockets.get(client.data.userID);
      const user = await this.usersService.findOneID(client.data.userID.id);
      if (player.status === GameStatus.QUEUED) {
        client.emit('error', 'Game not finished');
        return;
      }
      if (user.user_status === UserStatus.IN_GAME){
        client.emit('error', 'Game not finished');
        return;
      }
      if (player.status === GameStatus.READY){
        client.emit('error', 'Game not finished');
        return;
      }
      const game = await this.gameService.getLatestGame(client.data.userID.id);
      if (game && (game.winner == '' || game.looser == '')){
        client.emit('error', 'Game not finished');
        return;
      }
      const socketData: SocketData = this.setUserStatus(
        client,
        GameStatus.QUEUED,
      );

      const queue = data.hasMiddleWall ? this.WallQ : this.defaultQ;

      if (
        this.WallQ.find(
          user => user.userID['id'] === socketData.userID['id'],
        ) ||
        this.defaultQ.find(
          user => user.userID['id'] === socketData.userID['id'],
        )
      ) {
        throw new Error('User already in queue');
      }

      if (queue.length >= 1) {
        this.initGameRoom(socketData, queue[0], data.hasMiddleWall);
        queue.splice(0, 1);
      } else {
        socketData.status = GameStatus.QUEUED;
        queue.push(socketData);
      }
    } catch (e) {
      console.log('Error register: ', e.message);
      throw new WsException({
        message: 'Error register',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(@ConnectedSocket() client: Socket) {
    try {
      console.log('In leaveQueue');
      this.verifyToken(client);
      const player = this.userSockets.get(client.data.userID);
      if (!player || player.status !== GameStatus.QUEUED) return;
      const socketData = this.setUserStatus(client, GameStatus.WAITING);
      const userid = socketData.userID;
      this.defaultQ = this.defaultQ.filter(
        (user: any) => user.userID.id !== userid.id,
      );
      this.WallQ = this.WallQ.filter(
        (user: any) => user.userID.id !== userid.id,
      );
    } catch (e) {
      console.log('Error leaveQueue: ', e.message);
      throw new WsException({
        message: 'Error leaveQueue',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('Invite')
  async inviteUser(
    @MessageBody(new ValidationPipe()) data: InviteDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('Inviting user');
      this.verifyToken(client);
      const userID = client.data.userID.id;
      const invitedUserID = data.id;
      if (userID === invitedUserID)
        throw new Error('You cannot invite yourself');
      if ((await this.usersService.checkIfUserExists(invitedUserID)) == null)
        throw new Error('User does not exist');
      if ((await this.usersService.isBothUsersBlocked(userID, invitedUserID)))
        throw new Error('You are blocked by this user');
      this.setUserStatus(client, GameStatus.WAITING);

      const invited = await this.usersService.getExistingInvitation(
        userID,
        invitedUserID,
        'GAME',
      )
      if (invited)
        throw new Error('User already invited');

      const users = Array.from(this.userSockets.keys());
      const foundUser = users.find(user => user.id === invitedUserID);
      const invitedSocketData = this.userSockets.get(foundUser);
      const invite = await this.usersService.createInvite(
        { type: 'GAME', receiverId: invitedUserID },
        userID,
      );
      // if (invitedSocketData)
      this.server
        .to(invitedSocketData.client.id)
        .emit('Invited', { ...client.data.userID, inviteId: invite.id });
    } catch (e) {
      console.log('Error invite: ', e.message);
      throw new WsException({
        message: 'Error invite',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('Accept')
  async acceptInvitation(
    @MessageBody(new ValidationPipe()) data: AcceptDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('In acceptInvitation');
      this.verifyToken(client);
      const val = await this.usersService.findOneID(client.data.userID.id);
      if (val.user_status === UserStatus.IN_GAME)
        throw new Error('User is in game');
      const user = this.setUserStatus(client, GameStatus.READY);
      const checkInvite = await this.usersService.getInvite(data.inviteID);
      if (!checkInvite) return;
      const users = Array.from(this.userSockets.keys());
      const foundUser = users.find(user => user.id === checkInvite.senderId);
      const sender = this.userSockets.get(foundUser);
      const invite = await this.usersService.acceptInvite(
        data.inviteID,
        client.data.userID.id,
      );
      if (!sender || sender.status !== GameStatus.WAITING) {
        throw new Error('Sender is not waiting');
      }
      if (invite) {
        this.initGameRoom(sender, user, false);
      }
    } catch (e) {
      console.log('Error accept: ', e.message);
      throw new WsException({
        message: 'Error accept',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('Reject')
  async rejectInvitation(
    @MessageBody(new ValidationPipe()) data: RejectDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('In rejectInvitation');
      this.verifyToken(client);
      const userID = client.data.userID;
      this.setUserStatus(client, GameStatus.WAITING);
      const invite = await this.usersService.rejectInvite(data.inviteID);
      if (invite) {
        const users = Array.from(this.userSockets.keys());
        const foundUser = users.find(user => user.id === invite.senderId);
        const invitedSocketData = this.userSockets.get(foundUser);
        this.server.to(invitedSocketData.client.id).emit('Rejected', userID);
      }
    } catch (e) {
      console.log('Error reject: ', e.message);
      throw new WsException({
        message: 'Error reject',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('move')
  handleMove(@MessageBody(new ValidationPipe()) data: MoveDto, @ConnectedSocket() client: Socket) {
    try {
      this.verifyToken(client);
      const roomId = data.roomID;
      const keyStatus: KeyPress = data.key;
      const isPressed = data.isPressed;
      if (roomId in this.gameRooms)
        this.gameRooms[roomId].barSelect(keyStatus, client, isPressed);
    } catch (e) {
      console.log('Error move: ', e.message);
      throw new WsException({
        message: 'Error move',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('moveMobile')
  handleMoveMobile(
    @MessageBody(new ValidationPipe()) data: MoveMobileDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.verifyToken(client);
      const roomId = data.roomID;
      const keyStatus: KeyPress = data.key;
      if (roomId in this.gameRooms)
        this.gameRooms[roomId].moveMobile(keyStatus, client);
    } catch (e) {
      console.log('Error move: ', e.message);
      throw new WsException({
        message: 'Error move',
        error: e.message,
      });
    }
  }

  @SubscribeMessage('StartGame')
  async startGame(
    @MessageBody(new ValidationPipe()) data: StartGameDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('In startGame', client.data.userID.login);
      this.verifyToken(client);
      const roomID = data.roomID;
      await this.gameService.validateGame(roomID, client.data.userID.id);
      const socketData: SocketData = this.setUserStatus(
        client,
        GameStatus.READY,
      );

      if (!this.gameRooms[roomID]) {
        throw new Error('Game room does not exist');
      }
      client.join(roomID);
      await this.usersService.userStatusUpdate(
        socketData.userID.id,
        UserStatus.IN_GAME,
      );
      if (this.gameRooms[roomID]) {
        this.gameRooms[roomID].startGame(this.usersService, socketData);
      }
    } catch (e) {
      console.log('Error startGame: ', e.message);
      throw new WsException({
        message: 'Error start game',
        error: e.message,
      });
    }
  }

  private async initGameRoom(
    player2: SocketData,
    player1: SocketData,
    middleWall: boolean,
  ) {
    player1.playerNumber = 1;
    player1.status = GameStatus.READY;
    player2.playerNumber = 2;
    player2.status = GameStatus.READY;
    const roomID = await this.createGameRoom(player1, player2, middleWall);
    player1.gameID = roomID;
    player2.gameID = roomID;
    const user1 = await this.usersService.getUserById(player1.userID.id);
    const user2 = await this.usersService.getUserById(player2.userID.id);
    this.server.to(player2.client.id).emit('start', {
      playerNo: 2,
      players: {
        player1: user1,
        player2: user2,
      },
      roomID,
      hasMiddleWall: middleWall,
    });
    this.server.to(player1.client.id).emit('start', {
      playerNo: 1,
      players: {
        player1: user1,
        player2: user2,
      },
      roomID,
      hasMiddleWall: middleWall,
    });
  }

  verifyToken(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const userid = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return userid;
    } catch (e) {
      console.error('Error connecting to game gateway:', e.message);
      throw new WsException('Token expired');
    }
  }
}
