import { Socket } from 'socket.io';

export interface Game {
  gameID: string;
  player1: string;
  player2: string;
  player1Score: number;
  player2Score: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerStats {
  points: number;
  name: string;
}

export interface GameObject {
  paddle1: Position;
  paddle2: Position;
  ball: Position;
  player1: PlayerStats;
  player2: PlayerStats;
  time: number;
}

export enum GameStatus {
  WAITING,
  STARTED,
  ENDED,
  QUEUED,
  READY,
  SPECTATING,
}

export interface KeyPress {
  upKey: boolean;
  downKey: boolean;
}

export interface SocketData {
  client: Socket;
  gameID: string;
  userID: string;
  status: GameStatus;
}

export type UserMap = Map<string, SocketData>;

export type InvitationMap = Map<string, SocketData[]>;
