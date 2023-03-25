import { Injectable } from "@nestjs/common";
import { AuthenticatedSocket } from "src/utils/AuthenticatedScoket.interface";

export interface IGatewaySessionManager {
  getUserSocket(userId: number): AuthenticatedSocket;
  setUserSocket(userId: number, socket: AuthenticatedSocket): void;
  removeUserSocket(userId: number): void;
  getSockets(): Map<number, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, AuthenticatedSocket> = new Map();

  getUserSocket(userId: number): AuthenticatedSocket {
    return this.sessions.get(Number(userId));
  }

  setUserSocket(userId: number, socket: AuthenticatedSocket): void {
    this.sessions.set(Number(userId), socket);
  }

  removeUserSocket(userId: number): void {
    this.sessions.delete(Number(userId));
  }

  getSockets(): Map<number, AuthenticatedSocket> {
    return this.sessions;
  }
}
