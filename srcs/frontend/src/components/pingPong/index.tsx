import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";

const PingPong = () => {
  return (
    <PingPongContainer>
      <CountDown element={<PingPongCanvas />} />
    </PingPongContainer>
  );
};

export default PingPong;
