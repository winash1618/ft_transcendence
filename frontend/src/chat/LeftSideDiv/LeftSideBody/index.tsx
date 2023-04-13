import { useEffect, useState } from "react";
import { Nav } from "../../chat.functions";
import DirectChat from "./DirectChat";
import GroupChat from "./GroupChat";
import ExploreChat from "./ExploreChat";
import CreateChat from "./CreateChat";

interface LeftSideBodyProps {
	socket: any;
	Navbar: Nav;
	setNavbar: any;
	conversationID: any;
	setConversationID: any;
	conversations: any;
	UserProfilePicture: any;
	setMessages: any;
}

const LeftSideBody = ({
	socket,
	Navbar,
	setNavbar,
	conversationID,
	setConversationID,
	conversations,
	UserProfilePicture,
	setMessages,
}: LeftSideBodyProps) => {

	if (Navbar === Nav.DIRECT) {
		return (
			<DirectChat
				conversations={conversations}
				UserProfilePicture={UserProfilePicture}
				setConversationID={setConversationID}
				conversationID={conversationID}
				setMessages={setMessages}
			/>
		);
	}
	else if (Navbar === Nav.GROUPS) {
		return (
			<GroupChat
				conversations={conversations}
				UserProfilePicture={UserProfilePicture}
				setConversationID={setConversationID}
				conversationID={conversationID}
				setMessages={setMessages}
			/>
		);
	}
	else if (Navbar === Nav.EXPLORE) {
		return (
			<ExploreChat
				socket={socket}
				conversations={conversations}
			/>
		);
	}
	else if (Navbar === Nav.CREATE) {
		return (
			<CreateChat
				socket={socket}
				setNavbar={setNavbar}
			/>
		);
	}
};

export default LeftSideBody;
