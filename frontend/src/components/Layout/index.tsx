import React, { useEffect, useRef, useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { PlayCircleOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { TrophyOutlined } from "@ant-design/icons";
import {
  Badge,
  ConfigProvider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  theme,
} from "antd";
import axios, { BASE_URL, axiosPrivate } from "../../api";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";
import Loading from "../loading";
import {
  CustomSider,
  HeaderWrapper,
  InviteButtonsWrapper,
  InviteDescription,
  InviteWrapper,
  LogoImg,
  LogoWrapper,
  NotificationsLi,
  NotificationsUl,
  NotificationsWrapper,
} from "./layout.styled";
import UserInfo from "./userInfo";
import { IoNotifications } from "react-icons/io5";
import ButtonComponent from "../ButtonComponent";
import { Socket, io } from "socket.io-client";
import { setGameInfo, setSocket } from "../../store/gameReducer";
const { darkAlgorithm } = theme;

const timeInMinutes = process.env.REACT_APP_JWT_EXPIRES_IN as string;
const timeInMinutesNumber = parseInt(timeInMinutes.replace("m", "")) * 60;

const { Content, Footer, Header } = Layout;

const navItems = [
  { icon: HomeOutlined, path: "/", label: "Leaderboard" },
  { icon: PlayCircleOutlined, path: "/pingpong", label: "Play ping pong" },
  { icon: MessageOutlined, path: "/messages", label: "Messages" },
  { icon: TrophyOutlined, path: "/achievements", label: "Achievements" },
];

const Navbar: React.FC = () => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const { userInfo, token } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState<boolean>(false);
  const { socket } = useAppSelector((state) => state.game);
  const [selected, setSelected] = useState<string>("0");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [connectionTime, setConnectionTime] = useState(null);

  useEffect(() => {
    if (userInfo.id) {
      const checkIsGameStarted = async () => {
        try {
          const response = await axiosPrivate.get(`/game/${userInfo.id}`);
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      };
      checkIsGameStarted();
    }
  }, [userInfo]);

  useEffect(() => {
    socket?.on("Invited", (data) => {
      console.log(data);
      setItems((prev) => [
        ...prev,
        {
          key: data.id,
          inviteId: data.inviteId,
          type: "GAME",
          login: data.login,
        },
      ]);
    });
    socket?.on("start", (data) => {
      console.log(data);
      dispatch(
        setGameInfo({
          ...data,
          isGameStarted: true,
          hasMiddleWall: data.hasMiddleWall,
        })
      );
      navigate("/pingpong");
    });
    return () => {
      socket?.off("Invited");
      socket?.disconnect();
    };
  }, [socket]);

  const getToken = async () => {
    try {
      const response = await axios.get(`/token`);
      localStorage.setItem("auth", JSON.stringify(response.data));
      dispatch(setToken(response.data.token));
      dispatch(setUserInfo(response.data.user));
      if (!response.data.user.username) {
        navigate("/set-nickname");
      }
      if (
        !response.data.user.is_authenticated &&
        response.data.user.secret_code
      ) {
        navigate("/authenticate");
      }
      setIsLoadingPage(false);
      return response.data.token;
    } catch (err) {
      dispatch(logOut());
      navigate("/login");
    }
  };

  const getSocket = async () => {
    try {
      const socket = io(process.env.REACT_APP_GAME_GATEWAY, {
        withCredentials: true,
        auth: async (cb) => {
          const token = await getToken();
          cb({
            token,
          });
        },
      });
      dispatch(setSocket(socket));
      setConnectionTime(new Date());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSocket();
  }, [dispatch, setIsLoadingPage, navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = (currentTime.getTime() - connectionTime) / 1000;
      const tokenExpiryTime = timeInMinutesNumber;
      const timeBeforeExpiry = tokenExpiryTime - timeDifference;
      if (timeBeforeExpiry <= 10 && socket) {
        socket.disconnect();
        getSocket();
      }
    }, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, connectionTime, socket]);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (userInfo.id) {
      const getNotifications = async () => {
        try {
          const response = await axiosPrivate.get(
            `/users/${userInfo.id}/invitations`
          );
          setItems(
            response.data.map((item: any) => ({
              key: item.id,
              login: item.username,
              type: item.type,
              inviteId: item.id,
            }))
          );
        } catch (err) {
          console.log(err);
        }
      };
      getNotifications();
    }
  }, [userInfo]);

  useEffect(() => {
    if (location.pathname === "/") {
      setSelected("1");
    } else if (location.pathname === "/pingpong") {
      setSelected("2");
    } else if (location.pathname === "/messages") {
      setSelected("3");
    } else {
      setSelected("0");
    }
  }, [location]);

  const acceptInvite = async (item: any) => {
    if (item.type === "GAME") {
      socket.emit("Accept", {
        inviteID: item.inviteId,
      });

      setItems((prevItem) => {
        return prevItem.filter(
          (itemTmp) =>
            !(itemTmp.login === item.login && itemTmp.type === "GAME")
        );
      });
    } else {
      await axiosPrivate.put(`/users/${item.inviteId}/accept`);

      setItems((prevItem) => {
        return prevItem.filter(
          (itemTmp) =>
            !(itemTmp.login === item.login && itemTmp.type === "FRIEND")
        );
      });
    }
  };

  const declineInvite = async (item: any) => {
    if (item.type === "GAME") {
      socket.emit("Reject", {
        inviteID: item.inviteId,
      });
      setItems((prevItem) => {
        return prevItem.filter(
          (itemTmp) =>
            !(itemTmp.login === item.login && itemTmp.type === "GAME")
        );
      });
    } else {
      await axiosPrivate.put(`/users/${item.inviteId}/reject`);
      setItems((prevItem) => {
        return prevItem.filter(
          (itemTmp) =>
            !(itemTmp.login === item.login && itemTmp.type === "FRIEND")
        );
      });
    }
  };

  return (
    <>
      {isLoadingPage ? (
        <Loading />
      ) : (
        <ConfigProvider
          theme={{
            token: {
              colorTextLabel: "#fff",
              colorTextDescription: "#cccccc",
              colorTextHeading: "#fff",
              colorTextSecondary: "#d1d1d1",
              colorTextPlaceholder: "#8d8d8d",
              colorTextDisabled: "#fff",
            },
          }}
        >
          <Layout style={{ minHeight: "100%" }}>
            <CustomSider
              collapsedWidth="0"
              collapsible={true}
              onBreakpoint={(broken) => {
                console.log(broken);
              }}
              collapsed={isCollapsed}
              onCollapse={(collapsed, type) => {
                setIsCollapsed((prev) => !prev);
              }}
            >
              <LogoWrapper>
                <LogoImg src="https://www.pngall.com/wp-content/uploads/2016/05/Ping-Pong-Download-PNG.png" />
              </LogoWrapper>
              <Menu
                style={{
                  background: "var(--main-600)",
                  paddingBottom: "20px",
                  borderRadius: "15px",
                }}
                theme="dark"
                mode="inline"
                onSelect={(e) => {
                  setIsCollapsed(true);
                }}
                selectedKeys={[selected]}
                items={navItems.map((item, index) => ({
                  key: String(index + 1),
                  icon: React.createElement(item.icon),
                  label: <Link to={item.path}>{item.label}</Link>,
                }))}
              />
            </CustomSider>
            <Layout style={{ background: "var(--main-800)" }}>
              <Header
                style={{
                  padding: 0,
                  background: "var(--main-600)",
                  color: "white",
                  height: "auto",
                }}
              >
                <HeaderWrapper>
                  <NotificationsWrapper>
                    <a
                      style={{
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: items.length === 0 ? "none" : "all",
                      }}
                      onClick={() => setOpen((prev) => !prev)}
                    >
                      <Badge count={items.length} overflowCount={9}>
                        <IoNotifications color="#fff" size={30} />
                      </Badge>
                    </a>
                    {open && (
                      <NotificationsUl>
                        {items.map((item) => (
                          <NotificationsLi key={item.key}>
                            <InviteWrapper>
                              {item.type === "GAME" ? (
                                <InviteDescription>
                                  You have been invited by{" "}
                                  {item.login.length > 8
                                    ? item.login.substring(0, 8) + "..."
                                    : item.login}{" "}
                                  to play a game
                                </InviteDescription>
                              ) : (
                                <InviteDescription>
                                  You received a friend request from{" "}
                                  {item.login.length > 8
                                    ? item.login.substring(0, 8) + "..."
                                    : item.login}
                                </InviteDescription>
                              )}
                              <InviteButtonsWrapper>
                                <ButtonComponent
                                  style={{ padding: "0rem 0.5rem" }}
                                  onClick={() => acceptInvite(item)}
                                >
                                  Accept
                                </ButtonComponent>
                                <ButtonComponent
                                  style={{ padding: "0rem 0.5rem" }}
                                  onClick={() => declineInvite(item)}
                                >
                                  Decline
                                </ButtonComponent>
                              </InviteButtonsWrapper>
                            </InviteWrapper>
                          </NotificationsLi>
                        ))}
                      </NotificationsUl>
                    )}
                  </NotificationsWrapper>
                  <UserInfo />
                </HeaderWrapper>
              </Header>
              <Content
                style={{ margin: "24px 16px 0", background: "var(--main-800)" }}
              >
                <Outlet />
              </Content>
              <Footer
                style={{
                  textAlign: "center",
                  background: "var(--main-800)",
                  color: "#fff",
                }}
              >
                42 ft_transcendence ©2023
              </Footer>
            </Layout>
          </Layout>
        </ConfigProvider>
      )}
    </>
  );
};

export default Navbar;
