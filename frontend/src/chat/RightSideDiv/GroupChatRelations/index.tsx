import {
  GroupArrow,
  GroupAvatar,
  GroupInfo,
  GroupItem,
  GroupName,
  GroupTitle,
} from "./group.styled";
import { List, Avatar, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { UserProfilePicture } from "../../../assets";
import { FaUserPlus, FaUserFriends, FaUserSlash } from "react-icons/fa";
import { Colors, GNav } from "../../chat.functions";
import { useState } from "react";
import axios from "axios";
import { logOut } from "../../../store/authReducer";
import { useAppDispatch } from "../../../hooks/reduxHooks";

interface GroupChatRelationsProps {
  conversationID: string;
}

const menu = (
  <Menu>
    <Menu.Item key="chat">Chat</Menu.Item>
    <Menu.Item key="profile">Profile</Menu.Item>
    <Menu.Item key="invite">Invite</Menu.Item>
  </Menu>
);

const GroupChatRelations = ({ conversationID }: GroupChatRelationsProps) => {
  const dispatch = useAppDispatch();
  const [GroupNav, setGroupNav] = useState(GNav.GROUPS);
  const [results, setResults] = useState([]);
  const HandleGroupNavClick = (nav: any) => async () => {
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
    if (nav === GNav.GROUPS) {
      const token = await getToken();
      try {
        const result = await axios.get(
          `http://localhost:3001/users/chat/${conversationID}/members`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(result.data);
        console.log("hgfhgfhtf",result.data);
      } catch (err) {
        console.log(err);
      }
    }
    setGroupNav(nav);
  };

  return (
    <>
      <GroupTitle>
        <FaUserFriends
          onClick={HandleGroupNavClick(GNav.GROUPS)}
          color={GroupNav === GNav.GROUPS ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />
        <FaUserSlash
          onClick={HandleGroupNavClick(GNav.BLOCKED)}
          color={GroupNav === GNav.BLOCKED ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />
        <FaUserPlus
          onClick={HandleGroupNavClick(GNav.ADD)}
          color={GroupNav === GNav.ADD ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />
      </GroupTitle>
      {/* <List
        itemLayout="horizontal"
        dataSource={results}
        renderItem={(result) => (
          <GroupItem>
            <GroupInfo>
              <GroupAvatar src={UserProfilePicture} />
              <GroupName>{result.username}</GroupName>
              <Dropdown overlay={menu} trigger={["click"]}>
                <GroupArrow>
                  <DownOutlined className="Group-arrow" />
                </GroupArrow>
              </Dropdown>
            </GroupInfo>
          </GroupItem>
        )}
      /> */}
    </>
  );
};

export default GroupChatRelations;
