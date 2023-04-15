import React from "react";
import {
  HistoryInfoWrapper,
  HistoryScoreText,
  MatchHistoryTitle,
  PlayerInfo,
  PlayerName,
  PlayerNameWrapper,
  PlayerProfileWrapper,
  ProfileMatchHistoryContainer,
  ProfilePicture,
} from "./profileMatchHistory.styled";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { UserProfilePicture } from "../../../assets";
import { Tooltip } from "antd";

const ProfileMatchHistory = () => {
  const { matchHistory } = useAppSelector((state) => state.users);
  console.log(matchHistory);
  const { user } = useAppSelector((state) => state.users);
  return (
    <ProfileMatchHistoryContainer>
      <MatchHistoryTitle>Match History</MatchHistoryTitle>
      {matchHistory.length > 0 ? (
        matchHistory.map((match: any) => (
          <HistoryInfoWrapper>
            <PlayerInfo>
              <PlayerProfileWrapper>
                <ProfilePicture
                  src={
                    match.playerOne.username === user?.username
                      ? UserProfilePicture
                      : UserProfilePicture
                  }
                />
                <PlayerNameWrapper>
                  <Tooltip
                    title={
                      match.playerOne.username === user?.username
                        ? match.playerOne.username
                        : match.playerTwo.username
                    }
                  >
                    <PlayerName>
                      {match.playerOne.username === user?.username
                        ? match.playerOne.username
                        : match.playerTwo.username}
                    </PlayerName>
                  </Tooltip>
                </PlayerNameWrapper>
              </PlayerProfileWrapper>
              <HistoryScoreText>
                {" "}
                {match.playerOne.username === user?.username
                  ? match.player_score
                  : match.opponent_score}
              </HistoryScoreText>
            </PlayerInfo>
            <HistoryScoreText>-</HistoryScoreText>
            <PlayerInfo>
              <HistoryScoreText>
                {match.playerOne.username === user?.username
                  ? match.opponent_score
                  : match.player_score}
              </HistoryScoreText>
              <PlayerProfileWrapper>
                <ProfilePicture
                  src={
                    match.playerOne.username === user?.username
                      ? UserProfilePicture
                      : UserProfilePicture
                  }
                />
                <PlayerNameWrapper>
                  <Tooltip
                    title={
                      match.playerOne.username === user?.username
                        ? match.playerTwo.username
                        : match.playerOne.username
                    }
                  >
                    <PlayerName>
                      {match.playerOne.username === user?.username
                        ? match.playerTwo.username
                        : match.playerOne.username}
                    </PlayerName>
                  </Tooltip>
                </PlayerNameWrapper>
              </PlayerProfileWrapper>
            </PlayerInfo>
          </HistoryInfoWrapper>
        ))
      ) : (
        <HistoryInfoWrapper>No match history</HistoryInfoWrapper>
      )}
    </ProfileMatchHistoryContainer>
  );
};

export default ProfileMatchHistory;
