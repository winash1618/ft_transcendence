import { PingPongContainer, StatusText } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

const PingPong = ({
  player,
  roomID,
  socket,
}: {
  player: number;
  roomID: string;
  socket: Socket | null;
}) => {
  const [gameStatus, setGameStatus] = useState<number>(0);

  useEffect(() => {
    if (gameStatus !== 0) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [gameStatus]);

  useEffect(() => {
    socket?.on("win", (data) => {
      setGameStatus(1);
    });
    socket?.on("lose", (data) => {
      setGameStatus(2);
    });
    return () => {
      socket?.off("win", (data) => {
        setGameStatus(1);
      });
      socket?.off("lose", (data) => {
        setGameStatus(2);
      });
    };
  }, [socket]);
  return (
    <PingPongContainer>
      <CountDown
        element={
          <PingPongCanvas player={player} roomID={roomID} socket={socket} />
        }
      />
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

export default PingPong;
