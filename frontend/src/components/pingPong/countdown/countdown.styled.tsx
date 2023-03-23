import styled from "styled-components";

export const CountDownSvg = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  transform: rotateY(-180deg) rotateZ(-90deg);
`;

export const CountDownCircle = styled.circle`
  stroke-dasharray: 490px;
  stroke-dashoffset: 0px;
  stroke-linecap: round;
  stroke-width: 5px;
  stroke: #fff;
  fill: none;
  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 490px;
    }
  }
  animation: countdown 5s linear infinite forwards;
`;

export const CountDownNumber = styled.div`
  color: #fff;
  display: inline-block;
  font-size: 50px;
`;

export const CountDownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 200px;
  text-align: center;
`;
