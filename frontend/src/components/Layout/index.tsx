import React from "react";
import {
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Content, Footer, Sider } = Layout;

const navItems = [
  { icon: UserOutlined, path: "/", label: "Play ping pong" },
  { icon: UserOutlined, path: "/leaderboard", label: "Leaderboard" },
  { icon: UserOutlined, path: "/messages", label: "Messages" },
];

const Navbar: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100%" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu
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
      <Layout>
        <Content style={{ margin: "24px 16px 0" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          42 ft_transcendence ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Navbar;
