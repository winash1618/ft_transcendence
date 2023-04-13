import { useEffect, useRef, useState } from "react";
import { UserProfilePicture } from "../../assets";
import {
  LeaderboardItem,
  LeaderboardRank,
  LeaderboardAvatar,
  LeaderboardInfo,
  LeaderboardName,
  LeaderboardScore,
} from "./leader.styled";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../store/authReducer";
import axios from "../../api";

/*------------------------------------------------------------------*/
import { List, Avatar } from "antd";

interface LeaderboardData {
  id: number;
  name: string;
  score: number;
  avatar: string;
}

interface LeaderboardProps {
  data: LeaderboardData[];
}
/*------------------------------------------------------------------*/

const LeaderBoardPage = () => {
  const customStyles = {
    color: "white !important",
  };
  /*------------------------------------------------------------------*/
  const data = [
    {
      id: 2,
      name: "Jane",
      score: 90,
      avatar: "https://avatars.githubusercontent.com/u/789012",
    },
    {
      id: 3,
      name: "Bob",
      score: 80,
      avatar: "https://avatars.githubusercontent.com/u/345678",
    },
    {
      id: 4,
      name: "Alice",
      score: 70,
      avatar: "https://avatars.githubusercontent.com/u/901234",
    },
    {
      id: 1,
      name: "John",
      score: 100,
      avatar: "https://avatars.githubusercontent.com/u/123456",
    },
    {
      id: 5,
      name: "Mike",
      score: 65,
      avatar: "https://avatars.githubusercontent.com/u/567890",
    },
    {
      id: 6,
      name: "Sara",
      score: 60,
      avatar: "https://avatars.githubusercontent.com/u/234567",
    },
    {
      id: 7,
      name: "David",
      score: 55,
      avatar: "https://avatars.githubusercontent.com/u/890123",
    },
    {
      id: 8,
      name: "Emily",
      score: 50,
      avatar: "https://avatars.githubusercontent.com/u/456789",
    },
    {
      id: 9,
      name: "James",
      score: 45,
      avatar: "https://avatars.githubusercontent.com/u/012345",
    },
    {
      id: 10,
      name: "Julia",
      score: 40,
      avatar: "https://avatars.githubusercontent.com/u/678901",
    },
  ];
  /*------------------------------------------------------------------*/
  const [users, setUsers] = useState([]);

  /*------------------------------------------------------------------*/

  /*------------------------------------------------------------------*/
  const sortData = (data: LeaderboardData[]) => {
    return data.sort((a, b) => b.score - a.score);
  };
  /*------------------------------------------------------------------*/
  return (
    <div>
      <h2 style={{ color: "white" }}>----------</h2>
      <List
        itemLayout="horizontal"
        dataSource={sortData(data)}
        renderItem={(player, index) => (
          <LeaderboardItem key={player.id}>
            <LeaderboardRank>{index + 1}</LeaderboardRank>
            <LeaderboardName>{player.name}</LeaderboardName>
            <LeaderboardScore className="leaderboard-score">
              Score: {player.score}
            </LeaderboardScore>
            <LeaderboardAvatar
              className="leaderboard-avatar"
              src={player.avatar}
            />
          </LeaderboardItem>
        )}
      />
    </div>
  );
};

export default LeaderBoardPage;
