import styled from "styled-components";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./pingPong.functions";

export const StyledCanvas = styled.canvas`
  width: ${CANVAS_WIDTH};
  height: ${CANVAS_HEIGHT};
  background: #000;
  border: 1px solid black;
`;

export const PingPongContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const ScoreText = styled.div`
	font-size: 50px;
	padding: 20px;
	font-family: Consolas,monaco,monospace;
`;
