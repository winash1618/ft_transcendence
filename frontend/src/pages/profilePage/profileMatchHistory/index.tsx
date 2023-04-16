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
import { Col, Tooltip } from "antd";

const ProfileMatchHistory = () => {
  const { matchHistory } = useAppSelector((state) => state.users);
  console.log(matchHistory);
  const { user } = useAppSelector((state) => state.users);
  return (
    <ProfileMatchHistoryContainer>
      <MatchHistoryTitle>Match History</MatchHistoryTitle>
      <HistoryInfoWrapper>
        {matchHistory.length > 0 ? (
          matchHistory.map((match: any) => (
            <tr>
              <td style={{ padding: "20px 0px" }}>
                <PlayerInfo>
                  <PlayerProfileWrapper>
                    <ProfilePicture
                      src={
                        match.playerOne.username === user?.username
                          ? `http://localhost:3001/users/profile-image/${match.playerOne.profile_picture}`
                          : `http://localhost:3001/users/profile-image/${match.playerTwo.profile_picture}`
                      }
                      onError={(e) => {
                        e.currentTarget.src = UserProfilePicture;
                      }}
                      alt="A profile photo of the current user"
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
                </PlayerInfo>
              </td>
              <td style={{ padding: "20px 0px" }}>
                <HistoryScoreText>
                  {" "}
                  {match.playerOne.username === user?.username
                    ? match.player_score
                    : match.opponent_score}
                </HistoryScoreText>
              </td>
              <td style={{ padding: "20px 0px" }}>
                <HistoryScoreText>-</HistoryScoreText>
              </td>
              <td style={{ padding: "20px 0px" }}>
                <HistoryScoreText>
                  {match.playerOne.username === user?.username
                    ? match.opponent_score
                    : match.player_score}
                </HistoryScoreText>
              </td>
              <td style={{ padding: "20px 0px" }}>
                <PlayerInfo>
                  <PlayerProfileWrapper>
                    <ProfilePicture
                      src={
                        match.playerOne.username === user?.username
                          ? `http://localhost:3001/users/profile-image/${match.playerTwo.profile_picture}`
                          : `http://localhost:3001/users/profile-image/${match.playerOne.profile_picture}`
                      }
                      onError={(e) => {
                        e.currentTarget.src = UserProfilePicture;
                      }}
                      alt="A profile photo of the current user"
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
              </td>
            </tr>
          ))
        ) : (
          <HistoryInfoWrapper>No match history</HistoryInfoWrapper>
        )}
      </HistoryInfoWrapper>
    </ProfileMatchHistoryContainer>
  );
};

export default ProfileMatchHistory;
