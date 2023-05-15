import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { UserProfilePicture } from "../../../assets";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
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
import { BASE_URL } from "../../../api";
import { resetGameInfo } from "../../../store/gameReducer";

export let CANVAS_WIDTH =
  window.innerHeight < 0.9 * window.innerWidth
    ? window.innerHeight
    : 0.9 * window.innerWidth;
export let CANVAS_HEIGHT = 0.8 * CANVAS_WIDTH;

export type GameType = {
  pause: boolean;
  ball: {
    x: number;
    y: number;
    radius: number;
    borderColor: string;
    color: string;
  };
  wall: {
    x: number;
    gapTop: number;
    gapBottom: number;
    width: number;
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
    radius: 0.015 * CANVAS_WIDTH,
    borderColor: "BLACK",
    color: "WHITE",
  },
  wall: {
    x: (0.975 * CANVAS_HEIGHT) / 2,
    width: 0.025 * CANVAS_WIDTH,
    gapTop: (CANVAS_HEIGHT - 200) / 2,
    gapBottom: CANVAS_HEIGHT - 200,
  },
  paddle1: {
    x: 0,
    y: (0.875 * CANVAS_HEIGHT) / 2,
    width: 0.025 * CANVAS_WIDTH,
    height: 0.125 * CANVAS_HEIGHT,
    color: "WHITE",
  },
  paddle2: {
    x: 0.975 * CANVAS_WIDTH,
    y: (0.875 * CANVAS_HEIGHT) / 2,
    width: 0.025 * CANVAS_WIDTH,
    height: 0.125 * CANVAS_HEIGHT,
    color: "WHITE",
  },
};

const PingPongCanvas = () => {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useAppSelector((state) => state.game);
  const {
    players,
    player,
    roomID,
	timer,
    hasMiddleWall,
    player1Score: playerOneScore,
    player2Score: playerTwoScore,
  } = useAppSelector((state) => state.game);
  const { token } = useAppSelector((state) => state.auth);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(playerOneScore);
  const [player2Score, setPlayer2Score] = useState<number>(playerTwoScore);
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
    function handleResize() {
      canvaRef.current.width =
        window.innerHeight < 0.9 * window.innerWidth
          ? window.innerHeight
          : 0.9 * window.innerWidth;
      canvaRef.current.height =
        0.8 *
        (window.innerHeight < 0.9 * window.innerWidth
          ? window.innerHeight
          : 0.9 * window.innerWidth);
      setCanvasWidth(
        window.innerHeight < 0.9 * window.innerWidth
          ? window.innerHeight
          : 0.9 * window.innerWidth
      );
      setCanvasHeight(
        0.8 *
          (window.innerHeight < 0.9 * window.innerWidth
            ? window.innerHeight
            : 0.9 * window.innerWidth)
      );
      game.paddle2.x = 0.975 * canvaRef.current.width;
      game.paddle2.width = 0.025 * canvaRef.current.width;
      game.paddle2.height = 0.125 * canvaRef.current.height;
      game.paddle1.x = 0;
      game.wall.x = (0.95 * canvaRef.current.width) / 2;
      game.wall.gapBottom =
        (canvaRef.current.height - canvaRef.current.height / 4) / 2;
      game.wall.gapTop = canvaRef.current.height / 4;
      game.wall.width = 0.025 * canvaRef.current.width;
      game.paddle1.width = 0.025 * canvaRef.current.width;
      game.paddle1.height = 0.125 * canvaRef.current.height;
      game.ball.radius = 0.015 * canvaRef.current.width;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window]);

  useEffect(() => {
    if (canvaRef.current) {
      let ctx = canvaRef.current.getContext("2d");
      if (ctx) {
        requestAnimationFrame(() =>
          draw(
            ctx,
            game,
            player,
            setPlayer1Score,
            setPlayer2Score,
            hasMiddleWall
          )
        );
      }
    }
    window.addEventListener("mousemove", (event) => {
      socket?.emit("moveMouse", {
        roomID: roomID,
        y: event.clientY - canvaRef.current.offsetTop,
      });
    });
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
  }, [player, roomID, socket, window]);

  useEffect(() => {
    socket?.on("win", (data) => {
      setGameStatus(1);
    });
    socket?.on("lose", (data) => {
      setGameStatus(2);
    });
    socket?.on("draw", (data) => {
      setGameStatus(3);
    });
    socket?.on("gameUpdate", (data) => {
      game.ball.x = (data.ball.x * canvaRef.current.width) / 900;
      game.ball.y = (data.ball.y * canvaRef.current.height) / 800;
      game.paddle1.y = (data.paddle1.y * canvaRef.current.height) / 800;
      game.paddle2.y = (data.paddle2.y * canvaRef.current.height) / 800;
    });
    socket?.on("player1Score", (data) => {
      setPlayer1Score(data);
    });
    socket?.on("player2Score", (data) => {
      setPlayer2Score(data);
    });
    if (roomID.length > 0 && timer) {
      socket?.emit("StartGame", {
        roomID,
        hasMiddleWall,
      });
    }
    return () => {
      socket?.off("gameUpdate", (data) => {
        game.ball.x = (data.ball.x * canvaRef.current.width) / 900;
        game.ball.y = (data.ball.y * canvaRef.current.height) / 800;
        game.paddle1.y = (data.paddle1.y * canvaRef.current.height) / 800;
        game.paddle2.y = (data.paddle2.y * canvaRef.current.height) / 800;
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
      socket?.off("draw", (data) => {
        setGameStatus(3);
      });
    };
  }, [socket, player, dispatch, roomID]);

  useEffect(() => {
    if (canvaRef.current) {
      canvaRef.current.width =
        window.innerHeight < 0.9 * window.innerWidth
          ? window.innerHeight
          : 0.9 * window.innerWidth;
      canvaRef.current.height =
        0.8 *
        (window.innerHeight < 0.9 * window.innerWidth
          ? window.innerHeight
          : 0.9 * window.innerWidth);
      setCanvasWidth(
        window.innerHeight < 0.9 * window.innerWidth
          ? window.innerHeight
          : 0.9 * window.innerWidth
      );
      setCanvasHeight(
        0.8 *
          (window.innerHeight < 0.9 * window.innerWidth
            ? window.innerHeight
            : 0.9 * window.innerWidth)
      );
      game.paddle2.x = 0.975 * canvaRef.current.width;
      game.paddle2.width = 0.025 * canvaRef.current.width;
      game.paddle2.height = 0.125 * canvaRef.current.height;
      game.paddle1.x = 0;
      game.wall.x = (0.95 * canvaRef.current.width) / 2;
      game.wall.gapBottom =
        (canvaRef.current.height - canvaRef.current.height / 4) / 2;
      game.wall.gapTop = canvaRef.current.height / 4;
      game.wall.width = 0.025 * canvaRef.current.width;
      game.wall.x = (0.95 * canvaRef.current.width) / 2;
      game.wall.width = 0.025 * canvaRef.current.width;
      game.paddle1.width = 0.025 * canvaRef.current.width;
      game.paddle1.height = 0.125 * canvaRef.current.height;
      game.ball.radius = 0.015 * canvaRef.current.width;
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetGameInfo());
    };
  }, []);
  return (
    <PingPongContainer>
      <StyledCanvas
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        ref={canvaRef}
      />
      <ScoreWrapper>
        <ScoreUserInfoWrapper style={{ marginRight: "30px" }}>
          <GameProfileImg
            src={`${BASE_URL}/users/profile-image/${players.player1.profile_picture}/${token}`}
            onError={(e) => {
              e.currentTarget.src = UserProfilePicture;
            }}
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
            src={`${BASE_URL}/users/profile-image/${players.player2.profile_picture}/${token}`}
            onError={(e) => {
              e.currentTarget.src = UserProfilePicture;
            }}
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
        {gameStatus === 3 && (
          <StatusText initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Draw
          </StatusText>
        )}
      </AnimatePresence>
    </PingPongContainer>
  );
};

export default PingPongCanvas;
