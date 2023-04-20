import { useEffect } from "react";
import { Nav } from "../chat.functions";
import LeftSideBody from "./LeftSideBody";
import LeftSideHeader from "./LeftSideHeader";

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
} : LeftSideDivProps) => {
	useEffect(() => {
		console.log("left side div useEffect to reset everything when navbar changes");
		setMessages([]);
		setConversations([]);
		setConversationID(null);
	}, [socket, Navbar]);

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