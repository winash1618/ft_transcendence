import styled from "styled-components";

const LeaderboardItem = styled.div`
  border: 1px solid green;
  display: flex;
  align-items: center;
  margin-bottom: 2em;
  padding: 0.5em;
  border-radius: 5px;
  display: flex;
  align-items: space-between;
  justify-content: space-between;
`;

const LeaderboardRank = styled.div`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 15px;
`;

const LeaderboardAvatar = styled.img`
  max-width: 100%;
  height: auto;
  width: 70px;
  border-radius: 50%;
  margin-right: 15px;
`;

const LeaderboardInfo = styled.div`
  color: white;
  flex: 1;
`;

const LeaderboardName = styled.div`
  color: white;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const LeaderboardScore = styled.div`
  color: white;
  font-size: 14px;
`;

export {
  LeaderboardItem,
  LeaderboardRank,
  LeaderboardAvatar,
  LeaderboardInfo,
  LeaderboardName,
  LeaderboardScore,
};
