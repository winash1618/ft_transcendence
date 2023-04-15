import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";
import { Socket } from "socket.io-client";

const PingPong = ({
  player,
  players,
  roomID,
  mobile,
  socket,
}: {
  player: number;
  players: any;
  mobile: boolean;
  roomID: string;
  socket: Socket | null;
}) => {
  console.log(players);
  return (
    <PingPongContainer>
      <CountDown
        element={
          <PingPongCanvas
            player={player}
            roomID={roomID}
            mobile={mobile}
            socket={socket}
            players={players}
          />
        }
      />
    </PingPongContainer>
  );
};

export default PingPong;
