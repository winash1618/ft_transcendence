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
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { io } from "socket.io-client";
import { logOut } from "../../../store/authReducer";

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
	

	useEffect(() => {
		const getConversation = async (nav: Nav) => {
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
			  
			if (nav === Nav.DIRECT)
			{
				const token = await getToken();
				console.log(token);
				try {
					const result = await axios.get("http://localhost:3001/chat/direct", {
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
			else if (nav === Nav.GROUPS)
			{
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
			else if (nav === Nav.EXPLORE)
			{
				console.log("Explore");
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

		};
		getConversation(Navbar);
	}, [Navbar]);



	return (
		<>
			<ParentMessageNav>
				<StyledHiOutlineUser
					onClick={() => setNavbar(Nav.DIRECT)}
					color={Navbar === Nav.DIRECT ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledHiOutlineUserGroup
					onClick={() => setNavbar(Nav.GROUPS)}
					color={Navbar === Nav.GROUPS ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledBiCommentAdd
					onClick={() => setNavbar(Nav.CREATE)}
					color={Navbar === Nav.CREATE ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
				<StyledMdOutlineTravelExplore
					onClick={() => setNavbar(Nav.EXPLORE)}
					color={Navbar === Nav.EXPLORE ? Colors.WHITE : Colors.PRIMARY}
					size={30}
				/>
			</ParentMessageNav>
		</>
	);
}

export default LeftSideHeader;