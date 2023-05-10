import {
  LeaderboardItem,
  LeaderboardRank,
  LeaderboardAvatar,
  LeaderboardName,
  LeaderboardScore,
} from "./leader.styled";
import { useAppSelector } from "../../hooks/reduxHooks";
import axios, { BASE_URL } from "../../api";

import { List } from "antd";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { UserProfilePicture } from "../../assets";
const { Title } = Typography;
interface LeaderboardData {
  rank: number;
  login: string;
  rating: number;
  profile_picture: string;
}

interface LeaderboardProps {
  data: LeaderboardData[];
}

const LeaderBoardPage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<LeaderboardData[]>([]);
  const getInfos = async () => {
    try {
      const result = await axios.get(
        `${BASE_URL}/users/leaderboard/highest-score`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result.data);
      setData(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("i am in leaderboard useEffect");
    getInfos();
  }, []);

  return (
    <div>
      <Title style={{ color: "white" }}>Leaderboard</Title>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(player, index) => (
          <LeaderboardItem key={player.rank}>
            <LeaderboardRank>{index + 1}</LeaderboardRank>
            <LeaderboardName>{player.login}</LeaderboardName>
            <LeaderboardScore className="leaderboard-score">
              Score: {player.rating}
            </LeaderboardScore>
            <LeaderboardAvatar
              className="leaderboard-avatar"
              src={`${BASE_URL}/users/profile-image/${player.profile_picture}/${token}`}
              onError={(e) => {
                e.currentTarget.src = UserProfilePicture;
              }}
            />
          </LeaderboardItem>
        )}
      />
    </div>
  );
};

export default LeaderBoardPage;
