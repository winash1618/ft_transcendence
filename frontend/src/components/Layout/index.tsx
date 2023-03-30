import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios, { BASE_URL } from "../../api";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../store/authReducer";
import Loading from "../loading";
import {
  CustomSider,
  HeaderWrapper,
  LogoImg,
  LogoWrapper,
} from "./layout.styled";
import UserInfo from "./userInfo";
import { IoNotifications } from "react-icons/io5";

const { Content, Footer, Header } = Layout;

const navItems = [
  { icon: UserOutlined, path: "/", label: "Leaderboard" },
  { icon: UserOutlined, path: "/pingpong", label: "Play ping pong" },
  { icon: UserOutlined, path: "/messages", label: "Messages" },
];

const Navbar: React.FC = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [selected, setSelected] = useState<string>("0");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const getToken = async () => {
    try {
      const response = await axios.get(`/token`);
      localStorage.setItem("auth", JSON.stringify(response.data));
    //   if (!response.data.user.username) {
    //     navigate("/set-nickname");
    //   }
      dispatch(setUserInfo(response.data.user));
      setIsLoadingPage(false);
    } catch (err) {
      dispatch(logOut());
      window.location.replace(`${BASE_URL}/42/login`);
    }
  };

  useEffect(() => {
    getToken();
    if (location.pathname === "/") {
    }
  });

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
        <Layout style={{ minHeight: "100%" }}>
          <CustomSider
            collapsedWidth="0"
            collapsible={true}
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <LogoWrapper>
              <LogoImg src="https://www.pngall.com/wp-content/uploads/2016/05/Ping-Pong-Download-PNG.png" />
            </LogoWrapper>
            <Menu
              style={{ background: "var(--main-700)" }}
              theme="dark"
              mode="inline"
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
                background: "var(--main-700)",
                color: "white",
                height: "auto",
              }}
            >
              <HeaderWrapper>
                <IoNotifications size={30} />
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
      )}
    </>
  );
};

export default Navbar;
