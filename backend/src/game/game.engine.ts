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
  Paddle,
  BallMovement,
} from './interface/game.interface';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { GameService } from './game.service';

let GAME_WIDTH = 900;
let GAME_HEIGHT = 800;
let PADDLE_WIDTH = 0.025 * GAME_WIDTH;
let PADDLE_HEIGHT = 0.125 * GAME_HEIGHT;
let BALL_SIZE = 0.015 * GAME_WIDTH;
let BALL_SPEED = 0.005 * GAME_WIDTH;
let PADDLE_SPEED = 0.015 * GAME_HEIGHT;
const GAME_TIME = 30;
const GAME_POINTS = 1555;

export class GameEngine {
  gameID: string;
  server: Server;
  gameObj: GameObject;
  users: UserMap;
  player1: string;
  player2: string;
  ballMovement: BallMovement;
  interval: any;

  initGameObj(points: number, player1: string, player2: string, hasMiddleWall: boolean): GameObject {
    return {
      gameStatus: GameStatus.WAITING,
      paddle1: {
        x: 0.025 * GAME_WIDTH,
        y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        movingUp: false,
        movingDown: false,
      },
      paddle2: {
        x: GAME_WIDTH - PADDLE_WIDTH,
        y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        movingUp: false,
        movingDown: false,
      },
      ball: {
        x: GAME_WIDTH / 2,
        y: GAME_HEIGHT / 2,
      },
      player1: { points: 0, name: player1 },
      player2: { points: 0, name: player2 },
      gameSetting: {
        speed: 2,
        points: points,
        hasMiddleWall: hasMiddleWall,
      },
      remainingTime: GAME_TIME,
      time: 30,
    };
  }

  constructor(
    game: Game,
    server: Server,
    player1: SocketData,
    player2: SocketData,
    private gameService: GameService,
    hasMiddleWall: boolean,
  ) {
    this.gameID = game.gameID;
    this.server = server;
    this.gameObj = this.initGameObj(7, game.player1, game.player2, hasMiddleWall);
    this.ballMovement = {
      x: 0,
      y: 0,
      radian: 0,
    };
    this.users = new Map<string, SocketData>();
    this.users.set(game.player1, {
      playerNumber: 1,
      client: player1.client,
      gameID: game.gameID,
      userID: game.player1,
      status: GameStatus.WAITING,
    });
    this.users.set(game.player2, {
      playerNumber: 2,
      client: player2.client,
      gameID: game.gameID,
      userID: game.player2,
      status: GameStatus.WAITING,
    });
    this.player1 = game.player1;
    this.player2 = game.player2;
  }

  ballBounce(paddlePosition: number, isPaddle: boolean = true) {
    const isBallMovingRight = this.ballMovement.x > 0 ? -1 : 1;

    if (isPaddle) {
      // Bounce off a paddle
      const paddleTop = paddlePosition - BALL_SIZE;
      const paddleBottom = paddlePosition + PADDLE_HEIGHT;
      const paddleHeight = paddleBottom - paddleTop;
      const conflictPosition = paddleBottom - this.gameObj.ball.y;
      let yDirection = 0;
      let radianRatio = 0;

      if (conflictPosition / paddleHeight > 0.5) {
        yDirection = -1;
        if (this.gameObj.ball.y === GAME_HEIGHT - BALL_SIZE) {
          yDirection = 1;
        }
        radianRatio = (conflictPosition / paddleHeight - 0.5) * 2;
      } else {
        yDirection = 1;
        if (this.gameObj.ball.y === 0) {
          yDirection = -1;
        }
        radianRatio = 1 - (conflictPosition / paddleHeight) * 2;
      }

      this.ballMovement.radian = (radianRatio * Math.PI) / 4;
      this.ballMovement.x =
        isBallMovingRight *
        Math.cos(this.ballMovement.radian) *
        BALL_SPEED *
        this.gameObj.gameSetting.speed;
      this.ballMovement.y =
        yDirection *
        Math.sin(this.ballMovement.radian) *
        BALL_SPEED *
        this.gameObj.gameSetting.speed;
    } else {
      // Bounce off the center wall
      const angleOfIncidence = Math.atan2(this.ballMovement.y, this.ballMovement.x);
      const wallNormalAngle = Math.PI; // Wall is vertical, so its surface normal is horizontal (180 degrees)

      const reflectionAngle = 2 * wallNormalAngle - angleOfIncidence;

      this.ballMovement.x = -Math.cos(reflectionAngle) * BALL_SPEED * this.gameObj.gameSetting.speed;
      this.ballMovement.y = -Math.sin(reflectionAngle) * BALL_SPEED * this.gameObj.gameSetting.speed;
    }
  }

  ballMove() {
    const ballRightMax = GAME_WIDTH - BALL_SIZE;
    const ballBottomMax = GAME_HEIGHT - BALL_SIZE;

    this.gameObj.ball.x = Math.min(
      ballRightMax,
      Math.max(0, this.gameObj.ball.x + this.ballMovement.x),
    );

    this.gameObj.ball.y = Math.min(
      ballBottomMax,
      Math.max(0, this.gameObj.ball.y + this.ballMovement.y),
    );

    const ball = this.gameObj.ball;
    const paddle1 = this.gameObj.paddle1;
    const paddle2 = this.gameObj.paddle2;

    // Add wall properties
    const wallWidth = 10; // You can adjust the wall width
    const wallX = (GAME_WIDTH - wallWidth) / 2;
    const gapSize = 200; // You can adjust the gap size
    const gapTop = (GAME_HEIGHT - gapSize) / 2;
    const gapBottom = GAME_HEIGHT - gapSize;

    // Check for ball collision with walls
    if (ball.x <= 0) {
      // Player 2 scores
      this.gameObj.player2.points++;
      this.server
        .to(this.gameID)
        .emit('player2Score', this.gameObj.player2.points);
      this.resetBall();
      return;
    } else if (ball.x >= GAME_WIDTH - BALL_SIZE) {
      // Player 1 scores
      this.gameObj.player1.points++;
      this.server
        .to(this.gameID)
        .emit('player1Score', this.gameObj.player1.points);
      this.resetBall();
      return;
    }
    if (ball.x == 0) {
      this.ballMovement.y *= -1;
    }
    if (ball.y == ballBottomMax) {
      this.ballMovement.y *= -1;
    }
    if (ball.y <= 0) {
      this.ballMovement.y *= -1;
    }

    // Check for ball collision with middle wall
    if (this.gameObj.gameSetting.hasMiddleWall) {
      const ballIsInUpperGap = ball.y + BALL_SIZE <= gapTop;
      const ballIsInLowerGap = ball.y >= gapBottom;

      if (
        ball.x + BALL_SIZE >= wallX &&
        ball.x <= wallX + wallWidth &&
        !(ballIsInUpperGap || ballIsInLowerGap)
      ) {
        // Calculate new ball direction after bouncing off the middle wall
        this.ballBounce(0, false);
      }
    }

    // Check for ball collision with paddles
    if (
      paddle1.y <= ball.y + BALL_SIZE &&
      ball.y <= paddle1.y + PADDLE_HEIGHT &&
      paddle1.x <= ball.x &&
      ball.x <= paddle1.x + PADDLE_WIDTH &&
      this.ballMovement.x < 0
    ) {
      this.ballBounce(paddle1.y);
    }
    if (
      paddle2.y <= ball.y + BALL_SIZE &&
      ball.y <= paddle2.y + PADDLE_HEIGHT &&
      paddle2.x <= ball.x + BALL_SIZE &&
      ball.x + BALL_SIZE <= paddle2.x + PADDLE_WIDTH &&
      this.ballMovement.x > 0
    ) {
      this.ballBounce(paddle2.y);
    }
  }

  resetBall() {
    const safeDistanceFromWall = 50; // You can adjust the safe distance from the wall

    this.gameObj.ball.y = (GAME_HEIGHT - BALL_SIZE) / 2;

    // Choose a random side for the ball to start on
    const startingSide = Math.random() < 0.5 ? 1 : -1;
    const centerX = (GAME_WIDTH - BALL_SIZE) / 2;
    this.gameObj.ball.x = centerX + startingSide * safeDistanceFromWall;

    this.ballMovement.radian = (Math.random() * Math.PI) / 4;
    this.ballMovement.x =
      startingSide *
      Math.cos(this.ballMovement.radian) *
      BALL_SPEED *
      this.gameObj.gameSetting.speed;
    this.ballMovement.y =
      (Math.random() < 0.5 ? 1 : -1) *
      Math.sin(this.ballMovement.radian) *
      BALL_SPEED *
      this.gameObj.gameSetting.speed;
  }

  barMove(key: KeyPress, position: Position, isPressed: boolean) {
    if (key.upKey) {
      if (isPressed) {
        position.movingUp = true;
      } else {
        position.movingUp = false;
      }
    }
    if (key.downKey) {
      if (isPressed) {
        position.movingDown = true;
      } else {
        position.movingDown = false;
      }
    }
  }

  barSelect(keyStatus: KeyPress, client: Socket, isPressed: boolean) {
    if (this.users.get(client.data.userID) === undefined) {
      return;
    }
    if (this.users.get(client.data.userID).playerNumber === 1) {
      this.barMove(keyStatus, this.gameObj.paddle1, isPressed);
    } else if (this.users.get(client.data.userID).playerNumber === 2) {
      this.barMove(keyStatus, this.gameObj.paddle2, isPressed);
    }
  }

  moveMouse(y: number, client: Socket) {
    if (this.users.get(client.data.userID) === undefined) {
      return;
    }
    if (this.users.get(client.data.userID).playerNumber === 1) {
      this.gameObj.paddle1.y = y;
    } else if (this.users.get(client.data.userID).playerNumber === 2) {
      this.gameObj.paddle2.y = y;
    }
  }

  playerMove() {
    if (this.gameObj.paddle1.movingUp) {
      if (this.gameObj.paddle1.y >= PADDLE_SPEED)
        this.gameObj.paddle1.y = this.gameObj.paddle1.y - PADDLE_SPEED;
    }
    if (this.gameObj.paddle2.movingUp) {
      if (this.gameObj.paddle2.y >= PADDLE_SPEED)
        this.gameObj.paddle2.y = this.gameObj.paddle2.y - PADDLE_SPEED;
    }
    if (this.gameObj.paddle2.movingDown) {
      if (this.gameObj.paddle2.y <= GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_SPEED)
        this.gameObj.paddle2.y = this.gameObj.paddle2.y + PADDLE_SPEED;
    }
    if (this.gameObj.paddle1.movingDown) {
      if (this.gameObj.paddle1.y <= GAME_HEIGHT - PADDLE_HEIGHT - PADDLE_SPEED)
        this.gameObj.paddle1.y = this.gameObj.paddle1.y + PADDLE_SPEED;
    }
  }

  startSettings() {
    this.gameObj.time = GAME_TIME;
    this.interval = setInterval(() => {
      this.gameObj.remainingTime--;
      if (this.gameObj.remainingTime === 0) clearInterval(this.interval);
      else this.server.to(this.gameID).emit('gameUpdate', this.gameObj);
    }, 1000);
  }

  startGame(mobile: boolean, hasMiddleWall) {
    if (mobile) {
      GAME_WIDTH = 300;
      GAME_HEIGHT = 500;
      PADDLE_WIDTH = 10;
      PADDLE_HEIGHT = 50;
      BALL_SIZE = 6.25;
      BALL_SPEED = 2.5;
      PADDLE_SPEED = 7.5;
    }
    console.log(GAME_HEIGHT, GAME_WIDTH);
    clearInterval(this.interval);
    this.gameObj = this.initGameObj(0, this.player1, this.player2, hasMiddleWall);
    this.gameObj.gameStatus = GameStatus.PLAYING;
    this.resetBall();

    this.interval = setInterval(() => {
      this.ballMove();
      this.playerMove();
      this.server.to(this.gameID).emit('gameUpdate', this.gameObj);

      if (
        this.gameObj.player1.points >= GAME_POINTS ||
        this.gameObj.player2.points >= GAME_POINTS
      ) {
        clearInterval(this.interval);
        this.gameObj.gameStatus = GameStatus.WAITING;
        this.server.to(this.gameID).emit('gameUpdate', this.gameObj);
        const winner: string =
          this.gameObj.player1.points >= GAME_POINTS
            ? this.player1
            : this.player2;
        const looser: string =
          this.gameObj.player1.points >= GAME_POINTS
            ? this.player2
            : this.player1;
        this.users.get(winner).client.emit('win', winner);
        this.users.get(looser).client.emit('lose', looser);
        this.gameService.storeGameHistory({
          player_one: this.gameObj.player1.name.id,
          player_two: this.gameObj.player2.name.id,
          player_score: this.gameObj.player1.points,
          opponent_score: this.gameObj.player2.points,
          winner: '',
          looser: '',
        })
      }
    }, GAME_TIME);
  }

  stopGame() {}
}
