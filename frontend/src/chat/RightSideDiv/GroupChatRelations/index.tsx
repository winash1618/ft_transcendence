import {
  GroupArrow,
  GroupAvatar,
  GroupInfo,
  GroupItem,
  GroupName,
  GroupTitle,
} from "./group.styled";
import { List, Avatar, Dropdown, Menu, MenuProps, Button } from "antd";
import { DownOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { UserProfilePicture } from "../../../assets";
import { FaUserPlus, FaUserFriends, FaUserSlash } from "react-icons/fa";
import { Colors, GNav, Role } from "../../chat.functions";
import { useState } from "react";
import axios from "axios";
import { logOut } from "../../../store/authReducer";
import { useAppDispatch } from "../../../hooks/reduxHooks";

interface GroupChatRelationsProps {
  socket: any;
  conversationID: string;
  conversation: any;
}

const GroupChatRelations = ({
  socket,
  conversationID,
  conversation,
}: GroupChatRelationsProps) => {
  const [user, setUser] = useState<any>(null);
  /*-----------Handle User Click-------------------------------------------------*/
  const handleUserClick = (participant: any) => {
    setUser(participant.user);
  };
  /*-----------Handle User Click-------------------------------------------------*/
  /*-----------Handle Menu Click-------------------------------------------------*/
  const handleMenuClick = (e: any) => {
    if (e.target.textContent === "Make Admin") {
      socket?.emit("makeAdmin", {
        conversationID: conversation.id,
        userID: user.id,
      });
      setResults(
        results.map((result) => {
          if (result.user.id === user.id) {
            return { ...result, role: Role.ADMIN };
          }
          return result;
        })
      );
      console.log("Make Admin");
    } else if (e.target.textContent === "Ban") {
      console.log("User Ban", user);
      socket?.emit("banUser", {
        conversationID: conversation.id,
        userID: user.id,
      });
      setResults(results.filter((result) => result.user.id !== user.id));
      console.log("Ban");
    } else if (e.target.textContent === "Mute") {
      socket?.emit("muteUser", {
        conversationID: conversation.id,
        userID: user.id,
      });
      console.log("Mute");
    } else if (e.target.textContent === "Kick") {
      socket?.emit("removeParticipant", {
        conversationID: conversation.id,
        userID: user.id,
      });
      setResults(results.filter((result) => result.user.id !== user.id));
      console.log("Kick");
    }
  };
  /*-----------Handle Menu Click-------------------------------------------------*/
  /*-----------Handle Unban Click-------------------------------------------------*/
  const handleUnbanClick = (object: any) => {
    console.log("unban");
    setUser(object.user);
    socket?.emit("unbanUser", {
      conversationID: conversation.id,
      userID: object.user.id,
    });
    setResults(results.filter((result) => result.user.id !== object.user.id));
  };
  /*-----------Handle Unban Click-------------------------------------------------*/
  /*-----------Handle Add Click-------------------------------------------------*/
  const handleAddClick = (object: any) => {
    console.log("Add");
    setUser(object.username);
    socket?.emit("addParticipant", {
      conversationID: conversation.id,
      userID: object.id,
    });
    setResults(results.filter((result) => result.id !== object.id));
  };
  /*-----------Handle Add Click-------------------------------------------------*/
  /*-----------MENU-------------------------------------------------*/
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div onClick={(e) => handleMenuClick(e)}>Make Admin</div>,
      disabled:
        conversation && conversation.participants[0].role !== Role.OWNER
          ? true
          : false,
    },
    {
      key: "2",
      label: <div onClick={(e) => handleMenuClick(e)}>Ban</div>,
    },
    {
      key: "3",
      label: <div onClick={(e) => handleMenuClick(e)}>Mute</div>,
    },
    {
      key: "4",
      label: <div onClick={(e) => handleMenuClick(e)}>Kick</div>,
    },
  ];
  /*----------------------------------------------------------------*/
  /*----------------------------------------------------------------*/
  const dispatch = useAppDispatch();
  const [GroupNav, setGroupNav] = useState(GNav.GROUPS);
  const [results, setResults] = useState([]);
  const HandleGroupNavClick = (nav: any) => async () => {
    console.log("checking", conversation);
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
    if (nav === GNav.GROUPS && conversationID !== null) {
      const token = await getToken();
      console.log("conversationID", conversationID);
      try {
        const result = await axios.get(
          `http://localhost:3001/chat/${conversationID}/members`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(result.data);
        console.log("Group members", result.data);
      } catch (err) {
        console.log(err);
      }
    }
    if (nav === GNav.BLOCKED && conversationID !== null) {
      const token = await getToken();
      console.log(conversationID);
      try {
        const result = await axios.get(
          `http://localhost:3001/chat/channel/${conversationID}/banned`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(result.data);
        console.log("Banned Members", result);
      } catch (err) {
        console.log(err);
      }
    }
    if (nav === GNav.ADD && conversationID !== null) {
      const token = await getToken();
      console.log(conversationID);
      try {
        const result = await axios.get(
          `http://localhost:3001/chat/channel/${conversationID}/addFriends`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(result.data.friends);
        console.log("Add Members", result.data.friends);
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
      {GroupNav === GNav.GROUPS ? (
        <List
          itemLayout="horizontal"
          dataSource={results}
          renderItem={(result) => (
            <GroupItem key={result.id} onClick={() => handleUserClick(result)}>
              <GroupInfo>
                <GroupAvatar src={UserProfilePicture} />
                <GroupName>{result.user.username}</GroupName>
                {conversation.participants[0].role !== Role.USER ? (
                  result.role === "USER" ? (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <GroupArrow>
                        <DownOutlined className="group-arrow" />
                      </GroupArrow>
                    </Dropdown>
                  ) : (
                    <MinusCircleOutlined />
                  )
                ) : (
                  <MinusCircleOutlined />
                )}
              </GroupInfo>
            </GroupItem>
          )}
        />
      ) : GroupNav === GNav.BLOCKED ? (
        <List
          itemLayout="horizontal"
          dataSource={results}
          renderItem={(result) => (
            <GroupItem>
              <GroupInfo>
                <GroupAvatar src={UserProfilePicture} />
                <GroupName>{result.user.username}</GroupName>
                {conversation.participants[0].role !== Role.USER ? (
                  result.role === "USER" ? (
                    <Button
                      type="primary"
                      onClick={() => handleUnbanClick(result)}
                    >
                      Unban
                    </Button>
                  ) : (
                    <MinusCircleOutlined />
                  )
                ) : (
                  <MinusCircleOutlined />
                )}
              </GroupInfo>
            </GroupItem>
          )}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={results}
          renderItem={(result) => (
            <GroupItem>
              <GroupInfo>
                <GroupAvatar src={UserProfilePicture} />
                <GroupName>{result.username}</GroupName>
                {conversation.participants[0].role !== Role.USER ? (
                  <Button type="default" onClick={() => handleAddClick(result)}>
                    Add
                  </Button>
                ) : null}
              </GroupInfo>
            </GroupItem>
          )}
        />
      )}
    </>
  );
};
// onClick={() => handleAddClick(result)}
export default GroupChatRelations;
