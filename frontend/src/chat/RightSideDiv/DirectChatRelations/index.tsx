import { useEffect, useRef, useState } from "react";
import { UserProfilePicture } from "../../../assets";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../../store/authReducer";
import axios from "../../../api";
import {
  DirectItem,
  DirectInfo,
  DirectName,
  DirectAvatar,
  FriendTitle,
  DirectArrow,
} from "./direct.styled";

import { List, Avatar, Dropdown, Menu, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface DirectData {
  id: number;
  name: string;
  avatar: string;
}

interface UserInfo {
  id: number;
  login: string;
  username: string;
  avatar: string;
}

interface DirectChatRelationsProps {
  user: any;
}

/*-----------------------------------------*/
const handleMenuClick = (e: any) => {
  if (e.target.textContent === "Chat") {
    console.log("Chat");
  } else if (e.target.textContent === "Profile") {
    console.log("Profile");
  } else if (e.target.textContent === "Invite") {
    console.log("Invite");
  }
};
/*-----------------------------------------*/

const DirectChatRelations = ({ user }: DirectChatRelationsProps) => {
  const dispatch = useAppDispatch();
  /*----------------------------------------------------------------------------------------*/
  const getInfos = async () => {
    const getToken = async () => {
      try {
        const response = await axios.get("http://localhost:3001/token", {
          withCredentials: true,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        return response.data.token;
      } catch (err) {
        dispatch(logOut());
        window.location.reload();
        return null;
      }
    };

    const token = await getToken();
    try {
      const result = await axios.get(
        `http://localhost:3001/users/friends/${user.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResults(result.data);
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getInfos();
  }, []);
  /*----------------------------------------------------------------------------------------*/
  const [results, setResults] = useState<UserInfo[]>([]);
  /*----------------------------------------------------------------------------------------*/
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          onClick={(e) => handleMenuClick(e)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chat
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={(e) => handleMenuClick(e)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Profile
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          onClick={(e) => handleMenuClick(e)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Invite
        </a>
      ),
    },
  ];
  /*----------------------------------------------------------------------------------------*/
  return (
    <>
      <FriendTitle>
        <h2>All Friends</h2>
      </FriendTitle>
      <List
        itemLayout="horizontal"
        dataSource={results}
        renderItem={(result) => (
          <DirectItem>
            <DirectInfo>
              <DirectAvatar src={UserProfilePicture} />
              <DirectName>{result.username}</DirectName>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <DirectArrow>
                  <DownOutlined className="direct-arrow" />
                </DirectArrow>
              </Dropdown>
            </DirectInfo>
          </DirectItem>
        )}
      />
    </>
  );
};

export default DirectChatRelations;
