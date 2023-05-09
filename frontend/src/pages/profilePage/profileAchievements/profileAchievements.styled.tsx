import { Card } from "antd";
import styled from "styled-components";

export const ProfileAchievementsContainer = styled(Card)`
  background: var(--main-600);
  border-radius: 10px;
  padding: 30px 0px;
  height: 100%;
  max-width: 600px;
  border: none;
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

export const AchievementsTitle = styled.h1`
  font-size: 2rem;
  padding-bottom: 20px;
`;

export const AchievementsInfo = styled.div`
	
`

export const AchievementTitle = styled.h1`
	
`

export const AchievementDescription = styled.p`
	
`
