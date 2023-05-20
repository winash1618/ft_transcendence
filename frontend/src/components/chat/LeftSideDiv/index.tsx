import { useCallback, useEffect } from "react";
import { Nav } from "../chat.functions";
import LeftSideBody from "./LeftSideBody";
import LeftSideHeader from "./LeftSideHeader";
import { axiosPrivate } from "../../../api";

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
}: LeftSideDivProps) => {

	const handleDirectExists = useCallback(async (object) => {
		setConversationID(object);
		setMessages([]);
		try {
			const result = await axiosPrivate.get(`/chat/${object}/Messages`);
			setMessages(result.data);
		} catch (err) {
		}
	}, [setConversationID, setMessages]);

	const handleDirectMessage = useCallback(async (object) => {
		setConversationID(object.id)
		try {
			const result = await axiosPrivate.get(`/chat/direct`);
			setConversations(result.data);
			setMessages([]);
		} catch (err) {
		}
	}, [setConversations, setMessages, setConversationID]);

	useEffect(() => {
		const getTokenAndHandleSocketEvents = async () => {
			socket?.on('directExists', (object) => handleDirectExists(object));
			socket?.on('directMessage', (object) => handleDirectMessage(object));
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
