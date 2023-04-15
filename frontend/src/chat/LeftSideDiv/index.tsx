import { useEffect } from "react";
import { Nav } from "../chat.functions";
import LeftSideBody from "./LeftSideBody";
import LeftSideHeader from "./LeftSideHeader";

interface LeftSideDivProps {
	user: any;
	socket: any;
	Navbar: Nav;
	status: any;
	setNavbar: any;
	conversations: any;
	conversationID: any;
	setConversationID: any;
	UserProfilePicture: any;
	setConversations: any;
	setMessages: any;
}

const LeftSideDiv = ({
	user,
	socket,
	Navbar,
	status,
	setNavbar,
	conversations,
	conversationID,
	setConversationID,
	UserProfilePicture,
	setConversations,
	setMessages,
} : LeftSideDivProps) => {
	useEffect(() => {
		setMessages([]);
		setConversations([]);
		setConversationID("");
	}, [Navbar]);
	return (
		<>
			<LeftSideHeader
				user={user}
				socket={socket}
				Navbar={Navbar}
				setNavbar={setNavbar}
				setConversations={setConversations}
			/>
			<LeftSideBody
				socket={socket}
				Navbar={Navbar}
				status={status}
				setNavbar={setNavbar}
				conversations={conversations}
				conversationID={conversationID}
				setConversationID={setConversationID}
				UserProfilePicture={UserProfilePicture}
				setMessages={setMessages}
			/>
		</>
	);
};

export default LeftSideDiv;