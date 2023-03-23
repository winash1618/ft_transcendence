import React, { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import axios from "../../api";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../store/authReducer";
import Loading from "../loading";

const { Content, Footer, Sider } = Layout;

const navItems = [
	{ icon: UserOutlined, path: "/", label: "Play ping pong" },
	{ icon: UserOutlined, path: "/leaderboard", label: "Leaderboard" },
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
			try {
				await axios.get(`/auth/logout`);
			} catch (err) { }
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
			)}
		</>
	);
};

export default Navbar;
