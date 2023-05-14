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
import { ValidationPipe, UsePipes, UseGuards } from '@nestjs/common';
import {
	SocketData,
	UserMap,
	GameStatus,
	KeyPress,
	UserInfo,
} from './interface/game.interface';
import { JwtGuard } from 'src/utils/wsJWTGuard.guard';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/Register.dto';
import { InviteDto } from './dto/Invite.dto';
import { AcceptDto } from './dto/Accept.dto';
import { RejectDto } from './dto/Reject.dto';
import { MoveMouseDto } from './dto/moveMouse.dto';
import { MoveDto } from './dto/Move.dto';
import { StartGameDto } from './dto/StartGame.dto';
import { UserStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { WebSocketConfig } from 'src/utils/ws-config';

// @UseGuards(JwtGuard)
@WebSocketGateway(8002, WebSocketConfig.getOptions(new ConfigService()))
// @WebSocketGateway ()
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
		private configService: ConfigService
	) { }

	async handleConnection(client: Socket) {
		try {
			// const token = client.handshake.headers.token as string;
			const token = client.handshake.auth.token;
			const userid = this.jwtService.verify(token, {
				secret: this.configService.get('JWT_SECRET'),
			});
			if (!(await this.usersService.getUserById(userid['id'])))
				throw new Error('User not found');

			const oldUser = this.userSockets.get(userid);
			if (oldUser) {
				console.log('User reconnected: ', userid);
				this.handleDisconnect(client);
			}

			const game = await this.gameService.checkIfGameRunning(userid['id']);
			if (game) {
				client.join(game);
			}

			client.data.userID = userid;
			const user = await this.usersService.findOne(client.data.userID['login']);
			client.data.userID['login'] = user.username;
			// console.log('User connected: ', userid);

			this.setUserStatus(client, GameStatus.WAITING);
		}
		catch (e) {
			console.error('Error connecting to game gateway:', e.message);
			client.disconnect();
		}
	}

	handleDisconnect(client: any) {
		try {
			const userid = client.data.userID;
			// console.log('User disconnected: ', userid);
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
			player_score: -1,
			opponent_score: -1,
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

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('Register')
	async registerUser(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: RegisterDto,
	) {
		try {
			console.log('In register')
			const player = this.userSockets.get(client.data.userID);
			const user = await this.usersService.findOneID(client.data.userID.id);
			if (player.status === GameStatus.QUEUED)
				throw new Error('User is already in queue');
			if (user.status === UserStatus.IN_GAME)
				throw new Error('User is already playing');
			if (player.status === GameStatus.READY)
				throw new Error('User is ready for a different game');
			const socketData: SocketData = this.setUserStatus(
				client,
				GameStatus.WAITING,
			);

			const queue = data.hasMiddleWall ? this.WallQ : this.defaultQ;

			if (this.WallQ.find(user => user.userID['id'] === socketData.userID['id']) ||
				this.defaultQ.find(user => user.userID['id'] === socketData.userID['id'])
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
			console.log('In leaveQueue')
			const player = this.userSockets.get(client.data.userID);
			if (player.status !== GameStatus.QUEUED)
				throw new Error('User is not in queue');
			const socketData = this.setUserStatus(client, GameStatus.WAITING);
			const userid = socketData.userID;
			this.defaultQ = this.defaultQ.filter(
				(user: any) => user.userID.id !== userid.id,
			);
			this.WallQ = this.WallQ.filter(
				(user: any) => user.userID.id !== userid.id,
			);
		} catch (e) {
			throw new WsException({
				message: 'Error leaveQueue',
				error: e.message,
			});
		}
	}

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('Invite')
	async inviteUser(
		@MessageBody() data: InviteDto,
		@ConnectedSocket() client: Socket,
	) {
		try {
			console.log('Inviting user');
			const userID = client.data.userID.id;
			const invitedUserID = data.id;
			if (userID === invitedUserID)
				throw new Error('You cannot invite yourself');
			if ((await this.usersService.checkIfUserExists(invitedUserID)) == null)
				throw new Error('User does not exist');
			this.setUserStatus(client, GameStatus.WAITING);

			if (
				await this.usersService.checkIfUserSentThreeInvites(userID, invitedUserID)
			) {
				return new Error('You have already sent three invites to this user');
			}
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
			console.log('Error invite: ', e.message)
			throw new WsException({
				message: 'Error invite',
				error: e.message,
			});
		}
	}

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('Accept')
	async acceptInvitation(
		@MessageBody() data: AcceptDto,
		@ConnectedSocket() client: Socket,
	) {
		try {
			console.log('In acceptInvitation')
			const val = await this.usersService.findOneID(client.data.userID.id);
			if (val.status === UserStatus.IN_GAME)
				throw new Error('User is already playing');
			const user = this.setUserStatus(client, GameStatus.READY);
			const checkInvite = await this.usersService.getInvite(data.inviteID);
			if (!checkInvite) return;
			const users = Array.from(this.userSockets.keys());
			const foundUser = users.find(user => user.id === checkInvite.senderId);
			const sender = this.userSockets.get(foundUser);
			const invite = await this.usersService.acceptInvite(data.inviteID);
			if (!sender || sender.status !== GameStatus.WAITING) {
				throw new Error('Sender is not waiting');
			}
			if (invite) {
				console.log('Users are ready')
				this.initGameRoom(
					sender,
					user,
					false,
				);
			}
		} catch (e) {
			console.log('Error accept: ', e.message)
			throw new WsException({
				message: 'Error accept',
				error: e.message,
			});
		}
	}

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('Reject')
	async rejectInvitation(
		@MessageBody() data: RejectDto,
		@ConnectedSocket() client: Socket,
	) {
		try {
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
			throw new WsException({
				message: 'Error reject',
				error: e.message,
			});
		}
	}

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('moveMouse')
	handleMoveMouse(
		@MessageBody() data: MoveMouseDto,
		@ConnectedSocket() client: Socket,
	) {
		try {
			const roomId = data.roomID;
			if (roomId in this.gameRooms)
				this.gameRooms[roomId].moveMouse(data.y, client);
		} catch (e) {
			throw new WsException({
				message: 'Error move mouse',
				error: e.message,
			});
		}
	}

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('move')
	handleMove(@MessageBody() data: MoveDto, @ConnectedSocket() client: Socket) {
		try {
			const roomId = data.roomID;
			const keyStatus: KeyPress = data.key;
			const isPressed = data.isPressed;
			if (roomId in this.gameRooms)
				this.gameRooms[roomId].barSelect(keyStatus, client, isPressed);
		} catch (e) {
			throw new WsException({
				message: 'Error move',
				error: e.message,
			});
		}
	}

	// @UsePipes(new ValidationPipe())
	@SubscribeMessage('StartGame')
	async startGame(
		@MessageBody() data: StartGameDto,
		@ConnectedSocket() client: Socket,
	) {
		try {
			console.log('start game');
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
			console.log(e);
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
				player1: player1.userID,
				player2: player2.userID,
				player1Pic: user1.profile_pic,
				player2Pic: user2.profile_pic,
			},
			roomID,
			hasMiddleWall: middleWall,
		});
		this.server.to(player1.client.id).emit('start', {
			playerNo: 1,
			players: {
				player1: player1.userID,
				player2: player2.userID,
				player1Pic: user1.profile_pic,
				player2Pic: user2.profile_pic,
			},
			roomID,
			hasMiddleWall: middleWall,
		});
	}
}
