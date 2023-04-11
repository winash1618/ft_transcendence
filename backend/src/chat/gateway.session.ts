import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

export interface IGatewaySessionManager {
  getUserSocket(userId: string): Socket;
  setUserSocket(userId: string, socket: Socket): void;
  removeUserSocket(userId: string): void;
  getSockets(): Map<string, Socket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<string, Socket> = new Map();

  getUserSocket(userId: string): Socket {
    return this.sessions.get(userId);
  }

  getAllUserSockets(): Socket[] {
    return Array.from(this.sessions.values());
  }

  setUserSocket(userId: string, socket: Socket): void {
    this.sessions.set(userId, socket);
  }

  removeUserSocket(userId: string): void {
    this.sessions.delete(userId);
  }

  getSockets(): Map<string, Socket> {
    return this.sessions;
  }
}
