import { Card, Col, Row } from "antd";
import styled from "styled-components";

export const ProfilePersonalInfoContainer = styled(Card)`
  background: var(--main-600);
  border-radius: 10px;
  padding: 30px 0px;
  height: 100%;
  max-width: 600px;
  border: 1px solid #63a4ff;
  color: #fff;
  & .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
	width: 100%;
    justify-content: center;
  }
  @media (max-width: 603px) {
    padding: 0;
  }
`;

export const PersonalTitle = styled.h1`
  font-size: 1.1rem;
  text-align: left;
`;

export const CustomRow = styled(Row)`
  margin: 30px;
  @media (max-width: 603px) {
    margin: 10px;
  }
`;

export const PersonalInfo = styled.p`
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CustomCol = styled(Col)`
  width: 240px;
`;

export const OnlineStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px;
`;

export const PersonalInfoTitle = styled.h1`
  font-size: 2rem;
  padding-bottom: 20px;
`;
