import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { CANVAS_HEIGHT, CANVAS_WIDTH, draw } from "./pingPongCanvas.functions";
import { ScoreText, StyledCanvas } from "./pingPongCanvas.styled";

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
  roomID,
  socket,
}: {
  player: number;
  roomID: string;
  socket: Socket | null;
}) => {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (canvaRef.current) {
      canvaRef.current.width = CANVAS_WIDTH;
      canvaRef.current.height = CANVAS_HEIGHT;
      let ctx = canvaRef.current.getContext("2d");
      if (ctx) {
        requestAnimationFrame(() =>
          draw(ctx, game, player, setPlayer1Score, setPlayer2Score)
        );
      }
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
  }, [player]);

  useEffect(() => {
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
      socket?.emit("StartGame", roomID);
    }
    return () => {
      socket?.off("gameUpdate", (data) => {
        console.log(data);
      });
      socket?.off("player1Score", (data) => {
        setPlayer1Score(data);
      });
      socket?.off("player2Score", (data) => {
        setPlayer2Score(data);
      });
      socket?.disconnect();
    };
  }, [socket, player, dispatch, roomID]);
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
