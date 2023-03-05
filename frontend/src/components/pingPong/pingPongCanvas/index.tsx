import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
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
	pause: boolean;
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
	pause: false,
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

  useEffect(() => {
    axios.get("http://localhost:3001", { withCredentials: true });
    const socket = io("http://localhost:8001", { withCredentials: true });
    if (canvaRef.current) {
      canvaRef.current.width = CANVAS_WIDTH;
      canvaRef.current.height = CANVAS_HEIGHT;
      let ctx = canvaRef.current.getContext("2d");
      createBall(game.ball);
      if (ctx) {
        requestAnimationFrame(() =>
          draw(ctx, game, player, setPlayer1Score, setPlayer2Score, socket)
        );
      }
    }
    socket.on("pause", (data) => {
      console.log(data);
      game.pause = data;
    });
    socket.on("ballX", (data) => {
      if (player === 2) {
        game.ball.x = data;
      }
    });
    socket.on("ballY", (data) => {
      if (player === 2) {
        game.ball.y = data;
      }
    });
    socket.on("player1Y", (data) => {
      if (player === 2) {
        game.paddle1.y = data;
      }
    });
    socket.on("player2Y", (data) => {
      if (player === 1) {
        game.paddle2.y = data;
      }
    });
    socket.on("player1Score", (data) => {
      if (player === 2) {
        setPlayer1Score(data);
      }
    });
    socket.on("player2Score", (data) => {
      if (player === 2) {
        setPlayer2Score(data);
      }
    });
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
      socket.off("ballX", (data) => {
        if (player === 2) {
          game.ball.x = data;
        }
      });
      socket.off("ballY", (data) => {
        if (player === 2) {
          game.ball.y = data;
        }
      });
      socket.off("player1Y", (data) => {
        game.paddle1.y = data;
      });
      socket.off("player2Y", (data) => {
        game.paddle2.y = data;
      });
      socket.off("player1Score", (data) => {
        setPlayer1Score(data);
      });
      socket.off("player2Score", (data) => {
        setPlayer2Score(data);
      });
    };
  }, [player]);
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
