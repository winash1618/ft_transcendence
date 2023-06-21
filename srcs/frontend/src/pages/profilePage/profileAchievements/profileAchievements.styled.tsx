import { Card } from "antd";
import styled from "styled-components";

export const ProfileAchievementsContainer = styled(Card)`
  background: var(--main-600);
  border-radius: 10px;
  padding: 30px 0px 0px 0px;
  height: 100%;
  border: 1px solid #63a4ff;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 600px;
  color: #fff;
  & .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0px;
    width: 100%;
    justify-content: center;
  }
  @media (max-width: 603px) {
    padding: 0;
  }
`;

export const AchievementsTitle = styled.h1`
  font-size: 2rem;
  padding-bottom: 20px;
`;

export const AchievementsInfo = styled.div`
  border: 1px solid #63a4ff;
  padding: 20px;
  margin-bottom: 25px;
  box-sizing: border-box;
  width: 100%;
  border-radius: 10px;
`;

export const AchievementTitle = styled.h1``;

export const AchievementDescription = styled.p``;
