import React, { useEffect, useRef } from "react";
import { PingPongContainer, StyledCanvas } from "./pingPong.styled";

const PingPong = () => {
  const canvaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvaRef.current) {
      canvaRef.current.width = 1000;
      canvaRef.current.height = 1000;
      const context = canvaRef.current.getContext("2d");
      context?.moveTo(0, 0);
      context?.lineTo(200, 200);
    }
  }, []);

  return (
    <PingPongContainer>
      <StyledCanvas
        ref={canvaRef}
      />
    </PingPongContainer>
  );
};

export default PingPong;
