import { Injectable } from '@nestjs/common';
import { SocketData, UserInfo } from './interface/game.interface';
import { GameEngine } from './game.engine';

@Injectable()
export class GameGatewaySessionManager {
  private sessions: Map<UserInfo, SocketData> = new Map<UserInfo, SocketData>();
	private gameRooms: GameEngine[] = [];
	private defaultQ: SocketData[] = [];
	private WallQ: SocketData[] = [];

  getUserSocket(userId: any): SocketData {
    return this.sessions.get(userId);
  }

  getAllUserSockets(): SocketData[] {
    return Array.from(this.sessions.values());
  }

  getAllUserKeys(): any[] {
    return Array.from(this.sessions.keys());
  }

  getSession(): Map<UserInfo, SocketData> {
    return this.sessions;
  }

  setUserSocket(userId: UserInfo, socket: SocketData): void {
    this.sessions.set(userId, socket);
  }

  removeUserSocket(userId: UserInfo): void {
    this.sessions.delete(userId);
  }

  getSockets(): Map<UserInfo, SocketData> {
    return this.sessions;
  }

  getGameRooms(): GameEngine[] {
    return this.gameRooms;
  }

  seetGameRooms(gameID: string, engine): void {
    this.gameRooms[gameID] = engine;
  }

  checkGameRoom(gameID: string): boolean {
    return (gameID in this.gameRooms)
  }

  getGameRoom(gameID: string): GameEngine {
    return this.gameRooms[gameID];
  }

  getDefaultQ(): SocketData[] {
    return this.defaultQ;
  }

  setDefaultQ(defaultQ: SocketData[]): void {
    this.defaultQ = defaultQ;
  }

  getWallQ(): SocketData[] {
    return this.WallQ;
  }

  setWallQ(WallQ: SocketData[]): void {
    this.WallQ = WallQ;
  }

  addDefaultQ(socket: SocketData): void {
    this.defaultQ.push(socket);
  }

  addWallQ(socket: SocketData): void {
    this.WallQ.push(socket);
  }

  removeDefaultQ(userid: UserInfo): void {
    this.defaultQ = this.defaultQ.filter(
      (user: any) => user.userID.login !== userid.login,
    );
  }

  removeWallQ(userid: UserInfo): void {
    this.WallQ = this.WallQ.filter(
      (user: any) => user.userID.login !== userid.login,
    );
  }

  removeGameRoom(gameRoom: GameEngine): void {
    this.gameRooms = this.gameRooms.filter((g) => g !== gameRoom);
  }
}
