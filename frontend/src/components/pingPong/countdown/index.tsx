import React, { useEffect } from "react";
import Countdown from "react-countdown";
import {
  CountDownCircle,
  CountDownContainer,
  CountDownNumber,
  CountDownSvg,
} from "./countdown.styled";

const CountDown = React.memo<any>(({ element }: { element: JSX.Element }) => {
	useEffect(() => {
		console.log("countdown");
	}, [element])
  const renderer = ({ seconds, completed }: any) => {
    if (completed) {
      return element;
    } else {
      return (
        <CountDownContainer>
          <CountDownNumber>{seconds}</CountDownNumber>
          <CountDownSvg>
            <CountDownCircle r="78" cx="100" cy="100"></CountDownCircle>
          </CountDownSvg>
        </CountDownContainer>
      );
    }
  };
  return <Countdown date={Date.now() + 5000} renderer={renderer} />;
});

export default CountDown;
