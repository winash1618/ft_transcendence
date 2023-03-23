import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";

const PingPong = ({ player }: { player: number }) => {
  return (
    <PingPongContainer>
      <CountDown element={<PingPongCanvas player={player} />} />
    </PingPongContainer>
  );
};

export default PingPong;
