import styled from "styled-components";

export const PingPongContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const PlayerManual = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 2rem; /* set a fixed width to align it to the left */
  height: 1rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #fff;
  z-index: 1;

  @media screen and (min-width: 480px) {
    width: 10rem;
    height: 3rem;
  }

  @media screen and (min-width: 768px) {
    width: 20rem;
    height: 4rem;
  }

  @media screen and (min-width: 1024px) {
    width: 30rem;
    height: 5rem;
  }
`;

