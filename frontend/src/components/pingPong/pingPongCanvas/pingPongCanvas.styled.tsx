import styled from "styled-components";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./pingPongCanvas.functions";

export const StyledCanvas = styled.canvas`
  width: ${CANVAS_WIDTH};
  height: ${CANVAS_HEIGHT};
  background: #000;
  border: 1px solid black;
`;

export const ScoreText = styled.div`
  font-size: 50px;
  padding: 20px;
  font-family: Consolas, monaco, monospace;
`;
