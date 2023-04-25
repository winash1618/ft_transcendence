import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";

const PingPong = ({
  mobile,
}: {
  mobile: boolean;
}) => {
  return (
    <PingPongContainer>
      <CountDown
        element={
          <PingPongCanvas
            mobile={mobile}
          />
        }
      />
    </PingPongContainer>
  );
};

export default PingPong;
