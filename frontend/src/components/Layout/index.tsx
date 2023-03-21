import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from "../../api";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../store/authReducer";
import Loading from "../loading";
import { HeaderWrapper, LogoImg, LogoWrapper } from "./layout.styled";
import UserInfo from "./userInfo";
import { IoNotifications } from "react-icons/io5";

const { Content, Footer, Sider, Header } = Layout;

const navItems = [
  { icon: UserOutlined, path: "/", label: "Leaderboard" },
  { icon: UserOutlined, path: "/pingpong", label: "Play ping pong" },
  { icon: UserOutlined, path: "/messages", label: "Messages" },
];

const Navbar: React.FC = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const dispatch = useAppDispatch();
  const getToken = async () => {
    try {
      const response = await axios.get(`/token`);
      localStorage.setItem("auth", JSON.stringify(response.data));
      dispatch(setUserInfo(response.data.user));
      setIsLoadingPage(false);
    } catch (err) {
      dispatch(logOut());
      window.location.replace("http://localhost:3001/42/login");
    }
  };

  useEffect(() => {
    getToken();
  }, [getToken]);

  return (
    <>
      {isLoadingPage ? (
        <Loading />
      ) : (
        <Layout style={{ minHeight: "100%" }}>
          <Sider
            style={{ background: "#222222" }}
            breakpoint="lg"
            collapsedWidth="0"
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
              defaultSelectedKeys={["4"]}
              items={navItems.map((item, index) => ({
                key: String(index + 1),
                icon: React.createElement(item.icon),
                label: <Link to={item.path}>{item.label}</Link>,
              }))}
            />
          </Sider>
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
