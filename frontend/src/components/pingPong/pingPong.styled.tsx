import styled from "styled-components";
import { motion } from "framer-motion"

export const PingPongContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const StatusText = styled(motion.h1)`
	font-size: 2rem;
	position: absolute;
`
