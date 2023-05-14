import { GameType } from ".";
import { CANVAS_HEIGHT } from ".";
import { CANVAS_WIDTH } from ".";

type BallType = {
  x: number;
  y: number;
  radius: number;
  borderColor: string;
  color: string;
};
type PaddleType = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
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
  ctx.fillStyle = paddle1.color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
};

export const drawWalls = (ctx: any, game: GameType) => {
  ctx.fillRect(game.wall.x, 0, game.wall.width, game.wall.gapTop);
  ctx.fillRect(game.wall.x, game.wall.gapBottom, game.wall.width, CANVAS_HEIGHT - game.wall.gapBottom);
}

export const draw = (
  ctx: any,
  game: GameType,
  player: number,
  setPlayer1Score: any,
  setPlayer2Score: any,
  hasMiddleWall: boolean,
) => {
  if (!game.pause) {
    ctx.clearRect(0, 0, 2000 , 2000);
    drawPaddles(ctx, game.paddle1, game.paddle2);
    drawBall(ctx, game.ball);
    if (hasMiddleWall)
    {
      drawWalls(ctx, game);
    }
  }
  requestAnimationFrame(() =>
    draw(ctx, game, player, setPlayer1Score, setPlayer2Score, hasMiddleWall)
  );
};
