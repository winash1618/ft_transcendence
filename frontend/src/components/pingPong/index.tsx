import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";
import { Socket } from "socket.io-client";

const PingPong = ({
  player,
  roomID,
  socket,
}: {
  player: number;
  roomID: string;
  socket: Socket | null;
}) => {
  const element = (
    <PingPongCanvas player={player} roomID={roomID} socket={socket} />
  );

  return (
    <PingPongContainer>
      <CountDown
        element={
          <PingPongCanvas player={player} roomID={roomID} socket={socket} />
        }
      />
    </PingPongContainer>
  );
};

export default PingPong;
