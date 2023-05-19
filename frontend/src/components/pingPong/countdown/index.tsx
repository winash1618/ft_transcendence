import Countdown from "react-countdown";
import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  CountDownCircle,
  CountDownContainer,
  CountDownNumber,
  CountDownSvg,
} from "./countdown.styled";

const CountDown = ({ element }: { element: JSX.Element }) => {
  const { timer } = useAppSelector((state) => state.game);
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
  return (
    <Countdown date={Date.now() + (timer ? 5000 : 0)} renderer={renderer} />
  );
};

export default CountDown;
