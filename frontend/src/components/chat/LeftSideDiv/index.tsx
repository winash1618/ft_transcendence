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
	const { token } = useAppSelector((state) => state.auth);
	const resetState = useCallback(() => {
		console.log("left side div resetStateChat");
		setMessages([]);
		setConversations([]);
		setConversationID(null);
	}, [setMessages, setConversations, setConversationID]);

	useEffect(() => {
		console.log("left side div useEffect to reset everything when navbar changes");
		resetState();
	}, [socket, Navbar, resetState]);

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
	}, [handleDirectExists, handleDirectMessage, socket]);
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
				setGroupNav={setGroupNav}
			/>
		</>
	);
};

export default LeftSideDiv;