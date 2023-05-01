import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketData } from './interface/game.interface';

@Injectable()
export class GatewaySessionManager {
  private readonly sessions: Map<string, SocketData> = new Map();
  private readonly mobileSessions: Map<string, SocketData> = new Map();

  getUserSocket(userId: string): SocketData {
    return this.sessions.get(userId);
  }

  getMobileSocket(userId: string): SocketData {
    return this.mobileSessions.get(userId);
  }

  getAllUserSockets(): SocketData[] {
    return Array.from(this.sessions.values());
  }

  getAllMobileSockets(): SocketData[] {
    return Array.from(this.mobileSessions.values());
  }

  setUserSocket(userId: string, socket: SocketData): void {
    this.sessions.set(userId, socket);
  }

  setMobileSocket(userId: string, socket: SocketData): void {
    this.mobileSessions.set(userId, socket);
  }

  removeUserSocket(userId: string): void {
    this.sessions.delete(userId);
  }

  removeMobileSocket(userId: string): void {
    this.mobileSessions.delete(userId);
  }

  getSockets(): Map<string, SocketData> {
    return this.sessions;
  }

  getMobileSockets(): Map<string, SocketData> {
    return this.mobileSessions;
  }
}
