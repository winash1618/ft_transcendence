import { motion } from "framer-motion";
import styled from "styled-components";

export const StyledCanvas = styled.canvas`
  background: url("https://steamuserimages-a.akamaihd.net/ugc/563267371964767353/E4BE528E333C46F3CE6CF71A6678D2F0F8189BA7/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false");
  background-size: 100vh;
  backgroung-length: 100vh;
  border: 1px solid black;
`;

export const ScoreText = styled.div`
  font-size: 50px;
  padding: 20px;
  font-family: Consolas, monaco, monospace;
`;

export const StatusText = styled(motion.h1)`
  font-size: 3rem;
  position: absolute;
  -webkit-text-stroke: 2px black;
`;

export const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ScoreUserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  gap: 20px;
`;

export const GameProfileImg = styled.img`
  width: 70px;
  border-radius: 50%;
`;
