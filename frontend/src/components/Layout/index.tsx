import React, { useEffect, useRef, useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import { PlayCircleOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import {
  Badge,
  ConfigProvider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  theme,
} from "antd";
import axios, { BASE_URL } from "../../api";
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
import { setSocket } from "../../store/gameReducer";
const { darkAlgorithm } = theme;

const { Content, Footer, Header } = Layout;

const navItems = [
  { icon: HomeOutlined, path: "/", label: "Leaderboard" },
  { icon: PlayCircleOutlined, path: "/pingpong", label: "Play ping pong" },
  { icon: MessageOutlined, path: "/messages", label: "Messages" },
];

const Navbar: React.FC = () => {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const { userInfo } = useAppSelector((state) => state.auth);
  const [open, setOpen] = useState<boolean>(false);
  const { socket } = useAppSelector((state) => state.game);
  const [selected, setSelected] = useState<string>("0");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    socket?.on("Invited", (data) => {
      console.log(data);
      setItems((prev) => [
        ...prev,
        {
          key: data.id,
          login: data.login,
        },
      ]);
    });
    return () => {
      socket?.off("Invited");
      socket?.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`/token`);
        console.log(response);
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

        console.log("test");
        window.location.replace(`${BASE_URL}/42/login`);
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
      } catch (err) {
        console.log(err);
      }
    };
    getSocket();
  }, [dispatch, setIsLoadingPage, navigate]);

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
                        <IoNotifications size={30} />
                      </Badge>
                    </a>
                    {open && (
                      <NotificationsUl>
                        {items.map((item) => (
                          <NotificationsLi key={item.key}>
                            <InviteWrapper>
                              <InviteDescription>
                                You have been invited by{" "}
                                {item.login.length > 8
                                  ? item.login.substring(0, 8) + "..."
                                  : item.login}{" "}
                                to play a game
                              </InviteDescription>
                              <InviteButtonsWrapper>
                                <ButtonComponent
                                  onClick={() => {
                                    socket.emit("Accept", userInfo?.id);
                                    setItems((prevItem) => {
                                      return prevItem.filter(
                                        (itemTmp) => itemTmp.key !== item.key
                                      );
                                    });
                                  }}
                                >
                                  Accept
                                </ButtonComponent>
                                <ButtonComponent
                                  onClick={() => {
                                    socket.emit("Decline", userInfo?.id);
                                    setItems((prevItem) => {
                                      return prevItem.filter(
                                        (itemTmp) => itemTmp.key !== item.key
                                      );
                                    });
                                  }}
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
