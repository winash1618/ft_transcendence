import { Card } from "antd";
import styled from "styled-components";

export const ProfileMatchHistoryContainer = styled(Card)`
  background: var(--main-600);
  margin: 0px 0px;
  height: 100%;
  color: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 10px;
  border: 1px solid #63a4ff;
  padding: 30px 0px;
  max-width: 600px;
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

export const HistoryInfoWrapper = styled.table``;

export const PlayerName = styled.h1`
  font-size: 1.3rem;
  @media (max-width: 1200px) {
    font-size: 1rem;
  }
  @media (max-width: 603px) {
    font-size: 0.8rem;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

export const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const PlayerNameWrapper = styled.div`
  width: 90px;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  @media (max-width: 1200px) {
    width: 80px;
  }
  @media (max-width: 603px) {
    width: 60px;
  }
`;

export const ProfilePicture = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  @media (max-width: 1200px) {
    width: 50px;
    height: 50px;
  }
  @media (max-width: 603px) {
    width: 40px;
    height: 40px;
  }
`;

export const HistoryScoreText = styled.div`
  font-size: 3rem;
  text-align: center;
  padding: 15px;
  font-family: Consolas, monaco, monospace;
  @media (max-width: 1200px) {
    font-size: 2rem;
  }
  @media (max-width: 603px) {
    font-size: 1.5rem;
  }
`;

export const PlayerProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

export const MatchHistoryTitle = styled.h1`
  font-size: 2rem;
`;
