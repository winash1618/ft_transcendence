import { useCallback, useEffect } from "react";
import { Nav } from "../chat.functions";
import LeftSideBody from "./LeftSideBody";
import LeftSideHeader from "./LeftSideHeader";
import axios from "axios";
import { BASE_URL } from "../../../api";
import { useAppSelector } from "../../../hooks/reduxHooks";

interface LeftSideDivProps {
	user: any;
	socket: any;
	Navbar: Nav;
	setNavbar: any;
	conversations: any;
	conversationID: any;
	setConversationID: any;
	UserProfilePicture: any;
	setConversations: any;
	setMessages: any;
	setConversation: any;
	setStatus: any;
	conversation: any;
	setResults: any;
	setGroupResults: any;
	setGroupNav: any;
}

const LeftSideDiv = ({
	user,
	socket,
	Navbar,
	setNavbar,
	conversations,
	conversationID,
	setConversationID,
	UserProfilePicture,
	setConversations,
	setMessages,
	setConversation,
	setStatus,
	conversation,
	setResults,
	setGroupResults,
	setGroupNav
}: LeftSideDivProps) => {
	const { userInfo, token } = useAppSelector((state) => state.auth);

	const handleDirectExists = useCallback(async (object, token) => {
		console.log("direct exists");
		setConversationID(object);
		setMessages([]);
		try {
			const result = await axios.get(`${BASE_URL}/chat/${object}/Messages`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessages(result.data);
		} catch (err) {
			console.log(err);
		}
	}, [setConversationID, setMessages]);

	const handleDirectMessage = useCallback(async (object, token) => {
		console.log("In handdle direct message");
		setConversationID(object.id)
		try {
			const result = await axios.get(`${BASE_URL}/chat/direct`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setConversations(result.data);
			setMessages([]);
		} catch (err) {
			console.log(err);
		}
	}, [setConversations, setMessages, setConversationID]);

	useEffect(() => {
		const getTokenAndHandleSocketEvents = async () => {
			socket?.on('directExists', (object) => handleDirectExists(object, token));
			socket?.on('directMessage', (object) => handleDirectMessage(object, token));
		};
		getTokenAndHandleSocketEvents();
		return () => {
			socket?.off('directExists', handleDirectExists);
			socket?.off('directMessage', handleDirectMessage);
		};
	}, [handleDirectExists, handleDirectMessage, socket, token]);

	// const handleConversationLeft = useCallback((data) => {
	// 	console.log("handleConversationLeft in GroupChat");
	// 	console.log(data.leftUserID, userInfo.id);
	// 	if (data.leftUserID === userInfo.id) {
	// 		console.log("data in handleConversationLeft", data);
	// 		setConversationID(null);
	// 		setMessages([]);
	// 		setConversation(null);
	// 		setConversations(conversations.filter((conversation) => conversation.id !== data.conversationID));
	// 	}
	// }, [setMessages, setConversationID]);

	// useEffect(() => {
	// 	socket?.on('conversationLeft', handleConversationLeft);
	// 	return () => {
	// 		socket?.off('conversationLeft', handleConversationLeft);
	// 	};
	// }, [socket, handleConversationLeft]);

	return (
		<>
			<LeftSideHeader
				user={user}
				socket={socket}
				Navbar={Navbar}
				setNavbar={setNavbar}
				setConversations={setConversations}
				setConversation={setConversation}
				setResults={setResults}
				setConversationID={setConversationID}
				setMessages={setMessages}
			/>
			<LeftSideBody
				socket={socket}
				Navbar={Navbar}
				setNavbar={setNavbar}
				conversations={conversations}
				conversationID={conversationID}
				setConversationID={setConversationID}
				UserProfilePicture={UserProfilePicture}
				setMessages={setMessages}
				setConversation={setConversation}
				setStatus={setStatus}
				conversation={conversation}
				setGroupResults={setGroupResults}
			/>
		</>
	);
};

export default LeftSideDiv;