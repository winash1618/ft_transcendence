import { motion } from "framer-motion";
import styled from "styled-components";

export const StyledCanvas = styled.canvas`
  background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOLlI-AZNaGoMtEsOpdxPW0HQwEknpOCS2M7GPnj0_3KQhSnCanXpUoqIZBQPh0HU67Gw&usqp=CAU");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 10px;
  border: 1px solid green;
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
