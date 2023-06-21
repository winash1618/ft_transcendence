import { Button } from "antd";
import { motion } from "framer-motion";
import styled from "styled-components";

export const StyledCanvas = styled.canvas`
  border: 1px solid black;
  background-size: cover;
`;

export const ScoreText = styled.div`
  font-size: 35px;
  padding: 20px;
  font-family: Consolas, monaco, monospace;
  @media (max-width: 768px)
  {
    font-size: 20px;
    padding: 5px;
  }
  @media (max-width: 300px)
  {
    font-size: 10px;
    padding: 3px;
  }
`;

export const StatusText = styled(motion.h1)`
  font-size: 2.5rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 300px)
  {
    font-size: 1rem;
  }
  position: absolute;
  -webkit-text-stroke: 1px black;
`;

export const ScoreWrapper = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    padding-top: 10px;
  }
`;

export const ScoreUserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  gap: 20px;
  @media (max-width: 768px)
  {
    font-size: 1rem;
    gap: 10px;
  }
  @media (max-width: 300px)
  {
    font-size: 0.7rem;
    gap: 5px;
  }
`;

export const GameProfileImg = styled.img`
  width: 60px;
  border-radius: 50%;
  @media (max-width: 768px)
  {
    width: 40px;
  }
  @media (max-width: 300px)
  {
    width: 20px;
  }
`;

export const CustomButton = styled(Button)`
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background: none !important;
  height: 40px;
  width: 40px;
  display: none;
  position: absolute;
  border-radius: 5px;
  border: 1px solid #63a4ff;
  text-transform: capitalize;
  text-decoration: dashed;
  &:focus {
    background: none !important;
  }
  :hover {
    background: none !important;
  }
  @media (max-width: 768px)
  {
    display: block;
  }
`