import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { UserProfilePicture } from "../../../assets";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { draw } from "./pingPongCanvas.functions";
import {
  GameProfileImg,
  ScoreText,
  ScoreUserInfoWrapper,
  ScoreWrapper,
  StatusText,
  StyledCanvas,
} from "./pingPongCanvas.styled";
import { PingPongContainer } from "../pingPong.styled";

export let CANVAS_WIDTH = 900;
export let CANVAS_HEIGHT = 800;

export type GameType = {
  pause: boolean;
  ball: {
    x: number;
    y: number;
    radius: number;
    borderColor: string;
    color: string;
  };
  paddle1: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
  paddle2: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  };
};

let game: GameType = {
  pause: false,
  ball: {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: 12.5,
    borderColor: "BLACK",
    color: "WHITE",
  },
  paddle1: {
    x: 0,
    y: (CANVAS_HEIGHT - 100) / 2,
    width: 20,
    height: 100,
    color: "WHITE",
  },
  paddle2: {
    x: CANVAS_WIDTH - 20,
    y: (CANVAS_HEIGHT - 100) / 2,
    width: 20,
    height: 100,
    color: "WHITE",
  },
};

const PingPongCanvas = ({
  player,
  players,
  roomID,
  socket,
  mobile,
}: {
  player: number;
  players: any;
  mobile: boolean;
  roomID: string;
  socket: Socket | null;
}) => {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(900);
  const [canvasHeight, setCanvasHeight] = useState<number>(800);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (gameStatus !== 0) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [gameStatus]);

  useEffect(() => {
    if (canvaRef.current) {
      if (mobile) {
        canvaRef.current.width = 300;
        canvaRef.current.height = 500;
        game.paddle1.width = 10;
        game.paddle1.height = 50;
        game.paddle2.width = 10;
        game.paddle2.height = 50;
        game.paddle2.x = 300 - 10;
        game.paddle1.x = 0;
        game.paddle2.y = (500 / 2) - (50 / 2);
        game.paddle1.y = (500 / 2) - (50 / 2);
        game.ball.radius = 6.25;
      } else {
        canvaRef.current.width = CANVAS_WIDTH;
        canvaRef.current.height = CANVAS_HEIGHT;
      }
      let ctx = canvaRef.current.getContext("2d");
      if (ctx) {
        requestAnimationFrame(() =>
          draw(ctx, game, player, setPlayer1Score, setPlayer2Score)
        );
      }
    }
    if (mobile) {
      window.addEventListener("mousemove", (event) => {
        socket?.emit("moveMouse", {
          roomID: roomID,
          y: event.clientY - canvaRef.current.offsetTop,
        });
      });
    }
    window.addEventListener("keydown", (event) => {
      if (event.key === "w") {
        socket?.emit("move", {
          roomID: roomID,
          key: { upKey: true, downKey: false },
          isPressed: true,
        });
      } else if (event.key === "s") {
        socket?.emit("move", {
          roomID: roomID,
          key: { upKey: false, downKey: true },
          isPressed: true,
        });
      }
    });
    window.addEventListener("keyup", (event) => {
      if (event.key === "w") {
        socket?.emit("move", {
          roomID: roomID,
          key: { upKey: true, downKey: false },
          isPressed: false,
        });
      } else if (event.key === "s") {
        socket?.emit("move", {
          roomID: roomID,
          key: { upKey: false, downKey: true },
          isPressed: false,
        });
      }
    });
    return () => {
      window.removeEventListener("keydown", (event) => {
        if (event.key === "w") {
          socket?.emit("move", {
            roomID: roomID,
            key: { upKey: true, downKey: false },
            isPressed: true,
          });
        } else if (event.key === "s") {
          socket?.emit("move", {
            roomID: roomID,
            key: { upKey: false, downKey: true },
            isPressed: true,
          });
        }
      });
      window.removeEventListener("keyup", (event) => {
        if (event.key === "w") {
          socket?.emit("move", {
            roomID: roomID,
            key: { upKey: true, downKey: false },
            isPressed: false,
          });
        } else if (event.key === "s") {
          socket?.emit("move", {
            roomID: roomID,
            key: { upKey: false, downKey: true },
            isPressed: false,
          });
        }
      });
    };
  }, [player, roomID, socket]);

  useEffect(() => {
    socket?.on("win", (data) => {
      setGameStatus(1);
    });
    socket?.on("lose", (data) => {
      setGameStatus(2);
    });
    socket?.on("gameUpdate", (data) => {
      game.ball.x = data.ball.x;
      game.ball.y = data.ball.y;
      game.paddle1.y = data.paddle1.y;
      game.paddle2.y = data.paddle2.y;
    });
    socket?.on("player1Score", (data) => {
      setPlayer1Score(data);
    });
    socket?.on("player2Score", (data) => {
      setPlayer2Score(data);
    });
    if (roomID.length > 0) {
      if (mobile) {
        setCanvasWidth(300);
        setCanvasHeight(500);
      }
      socket?.emit("StartGame", {
        roomID,
        mobile,
      });
    }
    return () => {
      socket?.off("gameUpdate", (data) => {
        game.ball.x = data.ball.x;
        game.ball.y = data.ball.y;
        game.paddle1.y = data.paddle1.y;
        game.paddle2.y = data.paddle2.y;
      });
      socket?.off("player1Score", (data) => {
        setPlayer1Score(data);
      });
      socket?.off("player2Score", (data) => {
        setPlayer2Score(data);
      });
      socket?.off("win", (data) => {
        setGameStatus(1);
      });
      socket?.off("lose", (data) => {
        setGameStatus(2);
      });
      socket?.disconnect();
    };
  }, [socket, player, dispatch, roomID]);

  return (
    <PingPongContainer>
      <StyledCanvas
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        ref={canvaRef}
      />
      <ScoreWrapper>
        <ScoreUserInfoWrapper style={{ marginRight: "30px" }}>
          <GameProfileImg
            src={UserProfilePicture}
            alt="A profile photo of the current user"
          />
          {players.player1.login}
        </ScoreUserInfoWrapper>
        <ScoreText>
          {player1Score} : {player2Score}{" "}
        </ScoreText>
        <ScoreUserInfoWrapper style={{ marginLeft: "30px" }}>
          {players.player2.login}
          <GameProfileImg
            src={UserProfilePicture}
            alt="A profile photo of the current user"
          />
        </ScoreUserInfoWrapper>
      </ScoreWrapper>
      <AnimatePresence>
        {gameStatus === 1 && (
          <StatusText initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            You win
          </StatusText>
        )}
        {gameStatus === 2 && (
          <StatusText initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            You lose
          </StatusText>
        )}
      </AnimatePresence>
    </PingPongContainer>
  );
};

export default PingPongCanvas;
