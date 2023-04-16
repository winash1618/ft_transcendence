import { motion } from "framer-motion";
import styled from "styled-components";

export const StyledCanvas = styled.canvas`
  background: url("https://img.freepik.com/free-vector/space-game-background-neon-night-alien-landscape_107791-1624.jpg?w=2000&t=st=1679423442~exp=1679424042~hmac=9d1b8be4fd92d476cc4f12d0a457afc4e1e55a46cc1a977f4cc4ef442ee8036d");
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
