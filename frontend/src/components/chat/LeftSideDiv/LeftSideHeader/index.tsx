import {
	ParentMessageNav,
	StyledBiCommentAdd,
	StyledHiOutlineUser,
	StyledHiOutlineUserGroup,
	StyledMdOutlineTravelExplore,
} from "./LeftSideHeader.styled";
import { Nav, Colors } from "../../chat.functions";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import { logOut } from "../../../../store/authReducer";
import { Button, Menu } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { HiOutlineUser, HiOutlineUserGroup } from "react-icons/hi";
import { BiCommentAdd } from "react-icons/bi";
import { MdOutlineTravelExplore } from "react-icons/md";

interface LeftSideHeaderProps {
	user: any;
	socket: any;
	Navbar: Nav;
	setNavbar: (nav: Nav) => void;
	setConversations: (conversations: any) => void;
}

function LeftSideHeader({
	user,
	socket,
	Navbar,
	setNavbar,
	setConversations,
}: LeftSideHeaderProps) {
	const dispatch = useAppDispatch();
	const handleNavbarClick = async (nav: Nav) => {
		setConversations([]);
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
		if (nav === Nav.DIRECT) {
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/direct", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(result.data);
				setConversations(result.data);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		}
		else if (nav === Nav.GROUPS) {
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/groups", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConversations(result.data);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		}
		else if (nav === Nav.EXPLORE) {
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/explore", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConversations(result.data);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		}
		setNavbar(nav);
	};

	useEffect(() => {
		handleNavbarClick(Navbar);
	}, [Navbar]);

	return (
		<>
			<ParentMessageNav>
				<StyledHiOutlineUser
					onClick={() => handleNavbarClick(Nav.DIRECT)}
					color={Navbar === Nav.DIRECT ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledHiOutlineUserGroup
					onClick={() => handleNavbarClick(Nav.GROUPS)}
					color={Navbar === Nav.GROUPS ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledBiCommentAdd
					onClick={() => handleNavbarClick(Nav.CREATE)}
					color={Navbar === Nav.CREATE ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledMdOutlineTravelExplore
					onClick={() => handleNavbarClick(Nav.EXPLORE)}
					color={Navbar === Nav.EXPLORE ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
			</ParentMessageNav>
		</>
	);
};

export default LeftSideHeader;
