import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  createBall,
  draw,
  movePaddle,
  stopPaddle,
} from "./pingPongCanvas.functions";
import { ScoreText, StyledCanvas } from "./pingPongCanvas.styled";

export type GameType = {
  ball: {
    x: number;
    y: number;
    radius: number;
    speed: number;
    directionX: number;
    directionY: number;
    borderColor: string;
    velocityX: number;
    velocityY: number;
    color: string;
  };
  paddle1: {
    x: number;
    y: number;
    width: number;
    movingUp: boolean;
    movingDown: boolean;
    height: number;
    color: string;
    score: number;
  };
  paddle2: {
    x: number;
    y: number;
    movingUp: boolean;
    movingDown: boolean;
    width: number;
    height: number;
    color: string;
    score: number;
  };
};

let game: GameType = {
  ball: {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: 12.5,
    speed: 5,
    directionX: 1,
    directionY: 1,
    velocityX: 5,
    velocityY: 5,
    borderColor: "BLACK",
    color: "WHITE",
  },
  paddle1: {
    x: 0,
    y: (CANVAS_HEIGHT - 100) / 2,
    movingUp: false,
    movingDown: false,
    width: 20,
    height: 100,
    color: "WHITE",
    score: 0,
  },
  paddle2: {
    x: CANVAS_WIDTH - 20,
    y: (CANVAS_HEIGHT - 100) / 2,
    movingUp: false,
    movingDown: false,
    width: 20,
    height: 100,
    color: "WHITE",
    score: 0,
  },
};

const PingPongCanvas = ({ player }: { player: number }) => {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io("http://localhost:8001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    if (socket !== undefined) {
      console.log(socket);
    }
  }, [socket]);

  useEffect(() => {
    if (canvaRef.current) {
      canvaRef.current.width = CANVAS_WIDTH;
      canvaRef.current.height = CANVAS_HEIGHT;
      let ctx = canvaRef.current.getContext("2d");
      createBall(game.ball);
      if (ctx) {
        requestAnimationFrame(() =>
          draw(ctx, game, setPlayer1Score, setPlayer2Score)
        );
      }
    }
    window.addEventListener("keydown", (event) =>
      movePaddle(event, game, player)
    );
    window.addEventListener("keyup", (event) =>
      stopPaddle(event, game, player)
    );
    return () => {
      window.removeEventListener("keydown", (event) =>
        movePaddle(event, game, player)
      );
      window.removeEventListener("keyup", (event) =>
        stopPaddle(event, game, player)
      );
    };
  }, []);
  return (
    <>
      <StyledCanvas ref={canvaRef} />
      <ScoreText>
        {player1Score} : {player2Score}
      </ScoreText>
    </>
  );
};

export default PingPongCanvas;
