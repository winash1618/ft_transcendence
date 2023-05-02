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
import { UsersService } from 'src/users/users.service';
import { GatewaySessionManager } from './game.session';
import { RegisterDto } from './dto/Register.dto';
import { InviteDto } from './dto/Invite.dto';
import { AcceptDto } from './dto/Accept.dto';
import { RejectDto } from './dto/Reject.dto';
import { MoveMouseDto } from './dto/moveMouse.dto';
import { MoveDto } from './dto/Move.dto';
import { StartGameDto } from './dto/StartGame.dto';

@WebSocketGateway(8002, {
	cors: {
		origin: process.env.FRONTEND_BASE_URL,
		credentials: true,
	},
})
// @WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private gameRooms: GameEngine[] = [];
  private usersQueue: string[] = [];
  private invitedUser: InvitationMap = new Map<string, string[]>();
  private userSockets: UserMap = new Map<string, SocketData>();

  constructor(
    private gatewaySession: GatewaySessionManager,
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
    private usersService: UsersService,
  ) {}

	async handleConnection(client: Socket) {
		// const token = client.handshake.headers.token as string;
		const token = client.handshake.auth.token;
		const userid = this.jwtService.verify(token, {
			secret: process.env.JWT_SECRET,
		});
		client.data.userID = userid;
		const user = await this.usersService.findOne(client.data.userID['login']);
		client.data.userID['login'] = user.username;
		console.log('User connected: ', userid);

		this.setUserStatus(client, GameStatus.WAITING);
	}

  handleDisconnect(client: any) {
    const token = client.handshake.auth.token;
    const userid = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    // console.log('User disconnected: ', userid);
    this.gatewaySession.removeUserSocket(userid);
  }

  createGameRoom(player1: SocketData, player2: SocketData, hasMiddleWall: boolean) {
    const id = uuid4();
    const game: Game = {
      gameID: id,
      player1: player1.userID,
      player2: player2.userID,
      player1Score: 0,
      player2Score: 0,
    };
    console.log('creating game room: ', game.player1, game.player2)
    const gameRoom = new GameEngine(
      game,
      this.server,
      player1,
      player2,
      this.gameService,
      hasMiddleWall,
    );
    gameRoom.startSettings();
    this.gameRooms[id] = gameRoom;
    return id;
  }

  setUserStatus(client: Socket, status: GameStatus) {
    const userID: any = client.data.userID;
    console.log('setting user id: ', userID)
    if (!this.gatewaySession.getUserSocket(userID)) {
      const socketData: SocketData = {
        playerNumber: -1,
        client: client,
        gameID: '',
        userID: userID,
        status: status,
      };
      this.gatewaySession.setUserSocket(userID.id, socketData);
      return socketData;
    }
    let socketData = this.gatewaySession.getUserSocket(userID);
    socketData.status = status;
    return socketData;
  }

  @SubscribeMessage('Register')
  async registerUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RegisterDto,
  ) {
    console.log('In register user')
    let socketData: SocketData = this.setUserStatus(client, GameStatus.WAITING);

    if ( this.usersQueue.includes(socketData.userID)
    ) {
      this.server.to(client.id).emit('error');
      return;
    }
    if (this.usersQueue.length >= 1) {
      this.initGameRoom(socketData, this.usersQueue[0], data.hasMiddleWall);
      this.usersQueue.splice(0, 1);
    } else {
      socketData.status = GameStatus.READY;
      this.usersQueue.push(socketData.userID);
    }
  }

  @SubscribeMessage('Invite')
  async inviteUser(@MessageBody() data: InviteDto, @ConnectedSocket() client: Socket) {
    console.log('Inviting user');
    const userID = client.data.userID.id;
    const invitedUserID = data.username;
    if (await this.usersService.checkIfUserExists(invitedUserID) == null)
      throw new Error('User does not exist');
    const socketData: SocketData = this.setUserStatus(
      client,
      GameStatus.WAITING,
    );
    console.log('User is invited');
    if ((await this.usersService.checkIfUserSentThreeInvites(userID, invitedUserID))) {
      new Error('You have already sent three invites to this user');
    }
    const invitedSocketData = this.userSockets.get(invitedUserID);
    await this.usersService.createInvite({type: 'GAME', receiverId: invitedUserID}, userID);
    this.server.to(client.id).emit('Invited', invitedUserID);
    if (invitedSocketData && invitedSocketData.status === GameStatus.WAITING)
      this.server.to(invitedSocketData.client.id).emit('Invited', userID);
  }

  @SubscribeMessage('Accept')
  async acceptInvitation(
    @MessageBody() data: AcceptDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userID = client.data.userID;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.READY);
    if (!(await this.usersService.checkIfUserExists(data.inviteID)))
      throw new Error('User does not exist');
    const checkInvite = await this.usersService.getInvite(data.inviteID);
    if (!checkInvite)
      return;
    const sender = this.gatewaySession.getUserSocket(checkInvite.senderId);
    if (!sender || sender.status !== GameStatus.WAITING)
      return;
    if (sender && sender.status === GameStatus.WAITING) {
      const invite = await this.usersService.acceptInvite(data.inviteID);
      if (invite) {
        const invitedSocketData = this.userSockets.get(invite.senderId);
        this.initGameRoom(socketData, invitedSocketData.userID, data.hasMiddleWall);
      }
    }
  }

  @SubscribeMessage('Reject')
  async rejectInvitation(
    @MessageBody() data: RejectDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userID = client.data.userID;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.WAITING);
    if (!(await this.usersService.checkIfUserExists(data.inviteID)))
      throw new Error('User does not exist');
    const invite = await this.usersService.rejectInvite(data.inviteID, userID);
    if (invite) {
      const invitedSocketData = this.userSockets.get(invite.senderId);
      this.server.to(invitedSocketData.client.id).emit('Rejected', userID);
    }
  }

  @SubscribeMessage('moveMouse')
  handleMoveMouse(@MessageBody() data: MoveMouseDto, @ConnectedSocket() client: Socket) {
    const roomId = data.roomID;
    if (roomId in this.gameRooms)
      this.gameRooms[roomId].moveMouse(data.y, client);
  }


  @SubscribeMessage('move')
  handleMove(@MessageBody() data: MoveDto, @ConnectedSocket() client: Socket) {
    const roomId = data.roomID;
    const keyStatus: KeyPress = data.key;
    const isPressed = data.isPressed;
    if (roomId in this.gameRooms)
      this.gameRooms[roomId].barSelect(keyStatus, client, isPressed);
  }

  @SubscribeMessage('StartGame')
  async startGame(@MessageBody() data: StartGameDto, @ConnectedSocket() client: Socket) {
    console.log('start game');
    const roomID = data.roomID;
    const socketData: SocketData = this.setUserStatus(client, GameStatus.READY);

    if (!this.gameRooms[roomID]) {
      console.log('disconnected');
      client.disconnect();
      return;
    }
	console.log(socketData.gameID, "socket game id", roomID, "room id");
    if (socketData.status === GameStatus.READY) {
      if (socketData.gameID === roomID) {
        client.join(roomID);
      }
    }
    if (this.gameRooms[roomID]) {
      this.gameRooms[roomID].startGame(true);
      // this.gameRooms[roomID].startGame(data.hasMiddleWall);
    }
  }

  private initGameRoom(currentUser: SocketData, player1: string, middleWall: boolean = false) {
    let user = this.gatewaySession.getUserSocket(player1);
    if (!(user.status === GameStatus.WAITING || user.status === GameStatus.QUEUED))
      new Error('User is in a game');
    user.playerNumber = 1;
    user.status = GameStatus.READY;
    currentUser.playerNumber = 2;
    currentUser.status = GameStatus.READY;
    const roomID = this.createGameRoom(user, currentUser, true);
    // const roomID = this.createGameRoom(user, currentUser, data.middleWall);
    user.gameID = roomID;
    currentUser.gameID = roomID;
    this.server.to(currentUser.client.id).emit('start', {
      playerNo: 2,
      players: {
        player1: user.userID,
        player2: currentUser.userID,
      },
      roomID,
    });
    this.server.to(user.client.id).emit('start', {
      playerNo: 1,
      players: {
        player1: user.userID,
        player2: currentUser.userID,
      },
      roomID,
    });
  }
}
