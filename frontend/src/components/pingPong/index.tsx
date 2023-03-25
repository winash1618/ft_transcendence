import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";

const PingPong = ({ player, roomID }: { player: number, roomID: string }) => {
  return (
    <PingPongContainer>
      <CountDown element={<PingPongCanvas player={player} roomID={roomID} />} />
    </PingPongContainer>
  );
};

export default PingPong;
