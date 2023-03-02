import { GameType } from ".";

export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 800;

type BallType = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  borderColor: string;
  directionX: number;
  directionY: number;
  velocityX: number;
  velocityY: number;
  color: string;
};
type PaddleType = {
  x: number;
  y: number;
  movingUp: boolean;
  movingDown: boolean;
  width: number;
  height: number;
  color: string;
  score: number;
};

const drawBall = (ctx: any, ball: BallType) => {
  ctx.strokeStyle = ball.borderColor;
  ctx.lineWidth = 2;
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
};

const drawPaddles = (ctx: any, paddle1: PaddleType, paddle2: PaddleType) => {
  // Draw the paddles
  ctx.fillStyle = paddle1.color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

export const createBall = (ball: BallType) => {
  console.log("test");
  if (Math.round(Math.random()) === 1) {
    ball.directionX = 1;
  } else {
    ball.directionX = -1;
  }
  if (Math.round(Math.random()) === 1) {
    ball.directionY = 1;
  } else {
    ball.directionY = -1;
  }
};

const moveBall = (ball: BallType) => {
  ball.x += ball.velocityX * ball.directionX;
  ball.y += ball.velocityY * ball.directionY;
};

const checkCollision = (
  ball: BallType,
  paddle1: PaddleType,
  paddle2: PaddleType,
  setPlayer1Score: any,
  setPlayer2Score: any
) => {
  if (ball.y <= 0 || ball.y >= CANVAS_HEIGHT - ball.radius) {
    ball.directionY = -ball.directionY;
  }
  if (ball.x <= 0) {
    paddle2.score++;
    setPlayer2Score(paddle2.score);
    createBall(ball);
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
  }
  if (ball.x >= CANVAS_WIDTH - ball.radius) {
    paddle1.score++;
    setPlayer1Score(paddle1.score);
    createBall(ball);
    ball.x = CANVAS_WIDTH / 2;
    ball.y = CANVAS_HEIGHT / 2;
  }
  if (
    ball.x <= paddle1.x + paddle1.width + ball.radius &&
    ball.y >= paddle1.y &&
    ball.y <= paddle1.y + paddle1.height
  ) {
    ball.directionX = -ball.directionX;
  }
  if (
	ball.x >= paddle2.x - paddle2.width - ball.radius &&
	ball.y >= paddle2.y &&
	ball.y <= paddle2.y + paddle2.height
  ) {
	ball.directionX = -ball.directionX;
  }
};

export const draw = (
  ctx: any,
  game: GameType,
  setPlayer1Score: any,
  setPlayer2Score: any
) => {
  ctx.clearRect(0, 0, 1000, 1000);
  if (game.paddle1.movingUp && game.paddle1.y > 0) {
    game.paddle1.y -= 20;
  }
  if (
    game.paddle1.movingDown &&
    game.paddle1.y < CANVAS_HEIGHT - game.paddle1.height
  ) {
    game.paddle1.y += 20;
  }
  drawPaddles(ctx, game.paddle1, game.paddle2);
  moveBall(game.ball);
  checkCollision(
    game.ball,
    game.paddle1,
    game.paddle2,
    setPlayer1Score,
    setPlayer2Score
  );
  drawBall(ctx, game.ball);
  requestAnimationFrame(() =>
    draw(ctx, game, setPlayer1Score, setPlayer2Score)
  );
};

export const movePaddle = (e: any, game: GameType, canvas: any) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    game.paddle1.movingUp = true;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    game.paddle1.movingDown = true;
  }
};

export const stopPaddle = (e: any, game: GameType, canvas: any) => {
  if (e.key === "ArrowUp" || e.key === "w") {
    game.paddle1.movingUp = false;
  } else if (e.key === "ArrowDown" || e.key === "s") {
    game.paddle1.movingDown = false;
  }
};