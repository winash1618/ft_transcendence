import {
	ParentMessageNav,
	StyledBiCommentAdd,
	StyledHiOutlineUser,
	StyledHiOutlineUserGroup,
	StyledMdOutlineTravelExplore,
} from "./LeftSideHeader.styled";
import { Nav, Colors } from "../../chat.functions";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { BASE_URL } from "../../../../api";
interface LeftSideHeaderProps {
	user: any;
	socket: any;
	Navbar: Nav;
	setNavbar: (nav: Nav) => void;
	setConversations: (conversations: any) => void;
	setConversation: (conversation: any) => void;
	setResults: (results: any) => void;
}

function LeftSideHeader({
	user,
	socket,
	Navbar,
	setNavbar,
	setConversations,
	setConversation,
	setResults,
}: LeftSideHeaderProps) {
	const { token } = useAppSelector((state) => state.auth);
	const handleNavbarClick = useCallback(async (nav: Nav) => {
		setConversations([]);
		if (nav === Nav.DIRECT) {
			console.log("i am in leftside header", user.id);
			try {
				const result = await axios.get(`${BASE_URL}/chat/direct`, {
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
			try {
				const result = await axios.get(
					`${BASE_URL}/users/friends/${user.id}`,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setResults(result.data);
			} catch (err) {
				console.log(err);
			}
		} else if (nav === Nav.GROUPS) {
			try {
				const result = await axios.get(`${BASE_URL}/chat/groups`, {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConversations(result.data);
				setConversation(null);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		} else if (nav === Nav.EXPLORE) {
			try {
				const result = await axios.get(`${BASE_URL}/chat/explore`, {
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
	}, [setConversations, setResults, setNavbar, user, setConversation, token]);

	const setConversationsObject = async () => {
		console.log("handleConversationLeft in LeftSideHeader");
		try {
			const result = await axios.get(`${BASE_URL}/chat/groups`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setNavbar(Nav.GROUPS);
			setConversations(result.data);
		} catch (err) {
			setConversations([]);
			console.log(err);
		}
	}

	const handleSetConversationObject = useCallback(setConversationsObject, [setNavbar, setConversations, token]);

	useEffect(() => {
		console.log("i am in leftsideheader useEffect");
		if (user && user !== undefined) {
			handleNavbarClick(Navbar);
		}
	}, [Navbar, user, handleNavbarClick]);

	useEffect(() => {
		const handleConversationLeft = async (object: any) => {
			handleSetConversationObject();
		};
		const handlePasswordAdded = async (object: any) => {
			handleSetConversationObject();
		};
		const handlePasswordRemoved = async (object: any) => {
			handleSetConversationObject();
		};
		const handleConversationJoined = async (object: any) => {
			handleSetConversationObject();
		};
		const handleUserBan = async (object: any) => {
			if (object.bannedUserID === user.id) {
				handleSetConversationObject();
			}
		};
		const handleUserUnbanned = async (object: any) => {
			if (object.unbannedUserID === user.id) {
				handleSetConversationObject();
			}
		};
		const handleUserKicked = async (object: any) => {
			if (object.kickedUserID === user.id) {
				handleSetConversationObject();
			}
		};
		const handleUserMuted = async (object: any) => {
			if (object != null && object.mutedUserID !== null && object.mutedUserID === user.id) {
				handleSetConversationObject();
			}
		};
		const handleAdminMade = async (object: any) => {
			if (object.userID === object.admin) {
				handleSetConversationObject();
			}
		};

		socket?.on('adminMade', handleAdminMade);
		socket?.on('userMuted', handleUserMuted);
		socket?.on('userKicked', handleUserKicked);
		socket?.on('userUnbanned', handleUserUnbanned);
		socket?.on('userBanned', handleUserBan);
		socket?.on('conversationJoined', handleConversationJoined);
		socket?.on('conversationLeft', handleConversationLeft);
		socket?.on('conversationProtected', handlePasswordAdded);
		socket?.on('passwordRemoved', handlePasswordRemoved);

		return () => {
			socket?.off('adminMade', handleAdminMade);
			socket?.off('userMuted', handleUserMuted);
			socket?.off('userKicked', handleUserKicked);
			socket?.off('userUnbanned', handleUserUnbanned);
			socket?.off('userBanned', handleUserBan);
			socket?.off('conversationJoined', handleConversationJoined);
			socket?.off('conversationLeft', handleConversationLeft);
			socket?.off('conversationProtected', handlePasswordAdded);
			socket?.off('passwordRemoved', handlePasswordRemoved);
		};
	}, [socket, user, handleSetConversationObject]);

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
