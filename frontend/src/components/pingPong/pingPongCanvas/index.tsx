import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../../store/authReducer";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  createBall,
  draw,
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

const PingPongCanvas = ({
  player,
  roomID,
}: {
  player: number;
  roomID: string;
}) => {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
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
    getSocket();
  }, [dispatch]);

  useEffect(() => {
    if (canvaRef.current) {
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
    window.addEventListener("keydown", (event) => socket?.emit("move", true));
    window.addEventListener("keyup", (event) => socket?.emit("move", false));
    return () => {
      window.removeEventListener("keydown", (event) =>
        socket?.emit("move", true)
      );
      window.removeEventListener("keyup", (event) =>
        socket?.emit("move", false)
      );
    };
  }, [player]);

  useEffect(() => {
    // const getToken = async () => {
    //   try {
    //     const response = await axios.get("/token", {
    //       withCredentials: true,
    //     });
    //     localStorage.setItem("auth", JSON.stringify(response.data));
    //     dispatch(setUserInfo(response.data.user));
    //     return response.data.token;
    //   } catch (err) {
    //     dispatch(logOut());
    //     window.location.reload();
    //     return null;
    //   }
    // };
    // const getSocket = async () => {
    //   const socket = io(process.env.REACT_APP_SOCKET_URL, {
    //     withCredentials: true,
    //     auth: async (cb) => {
    //       const token = await getToken();
    //       cb({
    //         token,
    //       });
    //     },
    //   });
    //   setSocket(socket);
    // };
    globalSocket = socket;
    socket?.on("gameUpdate", (data) => {
      console.log(data);
    });
    // socket?.on("error", (data) => {
    //   console.log("error occured");
    //   socket?.disconnect();
    //   socket?.off("gameUpdate", (data) => {
    //     console.log(data);
    //   });
    //   getSocket();
    // });
    if (roomID.length > 0) {
      socket?.emit("StartGame", roomID);
    }
    return () => {
      socket?.off("gameUpdate", (data) => {
        console.log(data);
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
