import { PingPongContainer } from "./pingPong.styled";
import CountDown from "./countdown";
import PingPongCanvas from "./pingPongCanvas";
import { Socket } from "socket.io-client";

const PingPong = ({
  mobile,
  socket,
}: {
  mobile: boolean;
  socket: Socket | null;
}) => {
  return (
    <PingPongContainer>
      <CountDown
        element={
          <PingPongCanvas
            mobile={mobile}
            socket={socket}
          />
        }
      />
    </PingPongContainer>
  );
};

export default PingPong;
