import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../../store/authReducer";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  createBall,
  draw,
  movePaddle,
  stopPaddle,
} from "./pingPongCanvas.functions";
import { ScoreText, StyledCanvas } from "./pingPongCanvas.styled";
import axios from "../../../api";

export let globalSocket: Socket | null = null;

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
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();

  const getToken = async () => {
    try {
      const response = await axios.get("/token", {
        withCredentials: true,
      });
      localStorage.setItem("auth", JSON.stringify(response.data));
      dispatch(setUserInfo(response.data.user));
      return response.data.token;
    } catch (err) {
      dispatch(logOut());
      window.location.reload();
      return null;
    }
  };

  const getSocket = async () => {
    const socket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      auth: async (cb) => {
        const token = await getToken();
        cb({
          token,
        });
      },
    });
    setSocket(socket);
  };

  useEffect(() => {
    getSocket();
  }, []);

  useEffect(() => {
    if (canvaRef.current) {
		console.log('test');
      canvaRef.current.width = CANVAS_WIDTH;
      canvaRef.current.height = CANVAS_HEIGHT;
      let ctx = canvaRef.current.getContext("2d");
      createBall(game.ball);
      if (ctx) {
        requestAnimationFrame(() =>
          draw(ctx, game, player, setPlayer1Score, setPlayer2Score)
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
  }, [player]);

  useEffect(() => {
	globalSocket = socket;
    socket?.on("pause", (data) => {
      console.log(data);
      game.pause = data;
    });
    socket?.on("ballX", (data) => {
      if (player === 2) {
        game.ball.x = data;
      }
    });
    socket?.on("ballY", (data) => {
      if (player === 2) {
        game.ball.y = data;
      }
    });
    socket?.on("player1Y", (data) => {
      if (player === 2) {
        game.paddle1.y = data;
      }
    });
    socket?.on("player2Y", (data) => {
      if (player === 1) {
        game.paddle2.y = data;
      }
    });
    socket?.on("player1Score", (data) => {
      if (player === 2) {
        setPlayer1Score(data);
      }
    });
    socket?.on("player2Score", (data) => {
      if (player === 2) {
        setPlayer2Score(data);
      }
    });
    socket?.on("error", (data) => {
      console.log(data);
      socket?.disconnect();
      socket?.off("ballX", (data) => {
        if (player === 2) {
          game.ball.x = data;
        }
      });
      socket?.off("ballY", (data) => {
        if (player === 2) {
          game.ball.y = data;
        }
      });
      socket?.off("player1Y", (data) => {
        game.paddle1.y = data;
      });
      socket?.off("player2Y", (data) => {
        game.paddle2.y = data;
      });
      socket?.off("player1Score", (data) => {
        setPlayer1Score(data);
      });
      socket?.off("player2Score", (data) => {
        setPlayer2Score(data);
      });
      getSocket();
    });
    return () => {
      socket?.off("ballX", (data) => {
        if (player === 2) {
          game.ball.x = data;
        }
      });
      socket?.off("ballY", (data) => {
        if (player === 2) {
          game.ball.y = data;
        }
      });
      socket?.off("player1Y", (data) => {
        game.paddle1.y = data;
      });
      socket?.off("player2Y", (data) => {
        game.paddle2.y = data;
      });
      socket?.off("player1Score", (data) => {
        setPlayer1Score(data);
      });
      socket?.off("player2Score", (data) => {
        setPlayer2Score(data);
      });
      socket?.disconnect();
    };
  }, [socket]);
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
