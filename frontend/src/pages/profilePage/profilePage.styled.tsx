import { Col, Row } from "antd";
import styled from "styled-components";

export const ProfileContainer = styled.div`
  padding: 50px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const ProfileInfoContainer = styled(Row)`
  max-width: 1300px;
  margin-top: 50px;
  align-items: stretch;
  @media (max-width: 991px) {
    max-width: 600px;
  }
  @media (max-width: 603px) {
    max-width: 385px;
  }
`;

export const CustomCol = styled(Col)`
  width: 600px;
  @media (max-width: 603px) {
    width: 385px;
  }
  height: 470px;
  @media (max-width: 603px) {
    height: 350px;
  }
`;

export const ProfileCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
