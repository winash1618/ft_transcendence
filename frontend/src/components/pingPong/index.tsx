import { useEffect, useState } from "react";
import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import io, { Socket } from "socket.io-client";
import PingPongCanvas from "./pingPongCanvas";

const PingPong = () => {
  const [player, setPlayer] = useState<number>(1);

  useEffect(() => {
    if (Math.round(Math.random()) === 1) {
      setPlayer(2);
    }
  }, []);
  return (
    <PingPongContainer>
      <CountDown element={<PingPongCanvas player={player} />} />
    </PingPongContainer>
  );
};

export default PingPong;
