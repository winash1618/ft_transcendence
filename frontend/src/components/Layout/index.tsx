import React, { useEffect, useState } from "react";
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
  LogoImg,
  LogoWrapper,
  NotificationsCounter,
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

const NotificationMenu: React.FC = ({
  onDecline,
  onAccept,
}: {
  onDecline: any;
  onAccept: any;
}) => {
  return (
    <div>
      <ButtonComponent onClick={onAccept}>Accept</ButtonComponent>
      <ButtonComponent onClick={onDecline}>Decline</ButtonComponent>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const { socket } = useAppSelector((state) => state.game);
  const [selected, setSelected] = useState<string>("0");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [items, setItems] = useState<MenuProps["items"]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get("/token", {
          withCredentials: true,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        dispatch(setUserInfo(response.data.user));
        dispatch(setToken(response.data.token));
        return response.data.token;
      } catch (err) {
        dispatch(logOut());
        window.location.reload();
        return null;
      }
    };
    const getSocket = async () => {
      const socket = io(process.env.REACT_APP_SOCKET_URL, {
        withCredentials: true,
        auth: async (cb) => {
          const token = await getToken();
          cb({
            token,
          });
        },
      });
      dispatch(setSocket(socket));
    };
    getSocket();
  }, [dispatch]);

  useEffect(() => {
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
      } catch (err) {
        dispatch(logOut());
        window.location.replace(`${BASE_URL}/42/login`);
      }
    };
    getToken();
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

  useEffect(() => {
    socket?.on("Invited", (data) => {
      console.log(data);
    })
  }, [socket])

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
                  <Dropdown
                    disabled={items.length === 0}
                    menu={{ items }}
                    trigger={["click"]}
                  >
                    <Badge count={items.length} overflowCount={9}>
                      <IoNotifications size={30} />
                    </Badge>
                  </Dropdown>
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
