import { Spin } from "antd";
import styled from "styled-components";

const Loading = () => {
  return (
    <LoadingContainer>
      <Spin />
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default Loading;
