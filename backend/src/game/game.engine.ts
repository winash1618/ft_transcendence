import {
  Game,
  Position,
  PlayerStats,
  GameObject,
  GameStatus,
  KeyPress,
  SocketData,
  UserMap,
  InvitationMap,
  Paddle
} from './interface/game.interface';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';
import { Server } from 'socket.io';
import { interval } from 'rxjs';

const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const PADDLE_SPEED = 5;

export class GameEngine {
  gameID: string;
  server: Server;
  gameObj: GameObject;
  users: UserMap;
  player1: string;
  player2: string;
  interval: any;

  initGameObj(game: Game): GameObject {
    return {
      paddle1: { x: 0, y: (GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2), width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
      paddle2: { x: (GAME_WIDTH - PADDLE_WIDTH), y: (GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2), width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
      ball: { x: (GAME_WIDTH / 2 ), y: (GAME_HEIGHT / 2 ), dx: BALL_SPEED, dy: BALL_SPEED, size: BALL_SIZE },
      player1: { points: 0, name: game.player1 },
      player2: { points: 0, name: game.player2 },
      time: 30,
    };
  }

  constructor(game: Game, server: Server, player1: SocketData, player2: SocketData) {
    this.gameID = game.gameID;
    this.server = server;
    this.gameObj = this.initGameObj(game);
    this.users = new Map<string, SocketData>();
    this.users.set(
      game.player1,
      {
        client: player1.client,
        gameID: game.gameID,
        userID: game.player1,
        status: GameStatus.WAITING,
      }
    )
    this.users.set(
      game.player2,
      {
        client: player2.client,
        gameID: game.gameID,
        userID: game.player2,
        status: GameStatus.WAITING,
      }
    )
    this.player1 = game.player1;
    this.player2 = game.player2;
    this.interval = interval(1000);
  }

  moveBall(ball: GameObject['ball']) {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  ballCollision(ball: GameObject['ball']) {
    if (ball.y - ball.size <= 0 || ball.y + ball.size >= GAME_HEIGHT) {
      ball.dy = -ball.dy;
    }
  }

  checkCollision(ball: GameObject['ball'], leftPaddle: Paddle, rightPaddle: Paddle) {
    if (
      ball.x - ball.size <= leftPaddle.x + leftPaddle.width &&
      ball.y >= leftPaddle.y &&
      ball.y <= leftPaddle.y + leftPaddle.height
    ) {
      ball.dx = BALL_SPEED;
    }

    // Check for collision with right paddle
    if (
      ball.x + ball.size >= rightPaddle.x &&
      ball.y >= rightPaddle.y &&
      ball.y <= rightPaddle.y + rightPaddle.height
    ) {
      ball.dx = -BALL_SPEED;
    }

    // Check for collision with top and bottom walls
    if (ball.y - ball.size <= 0 || ball.y + ball.size >= GAME_HEIGHT) {
      ball.dy = -ball.dy;
    }

    // Check for collision with left and right walls
    if (ball.x - ball.size <= 0) {
      ball.dx = BALL_SPEED;
      this.gameObj.player2.points++;
    }

    if (ball.x + ball.size >= GAME_WIDTH) {
      ball.dx = -BALL_SPEED;
      this.gameObj.player1.points++;
    }
  }

  movePaddle(paddle: Paddle, keyPress: KeyPress) {
    if (keyPress.upKey) {
      paddle.y -= PADDLE_SPEED;
    }
    if (keyPress.downKey) {
      paddle.y += PADDLE_SPEED;
    }
  }

  checkPaddleCollision(paddle: Paddle) {
    if (paddle.y < 0) {
      paddle.y = 0;
    } else if (paddle.y + paddle.height > GAME_HEIGHT) {
      paddle.y = GAME_HEIGHT - paddle.height;
    }
  }

  updateGameState() {
    this.moveBall(this.gameObj.ball);
    this.checkCollision(this.gameObj.ball, this.gameObj.paddle1, this.gameObj.paddle2);
    this.checkPaddleCollision(this.gameObj.paddle1);
    this.checkPaddleCollision(this.gameObj.paddle2);
  }

  startGame() {
    this.interval.subscribe(() => {
      this.gameObj.time--;
      if (this.gameObj.time === 0) {
        this.gameOver();
      }
    });
  }

  gameOver() {
    this.interval.unsubscribe();
    this.server.to(this.gameID).emit('gameOver', this.gameObj);
  }

  pauseGame() {
    this.interval.unsubscribe();
  }

  resumeGame() {
    this.interval = interval(1000);
    this.startGame();
  }
}
