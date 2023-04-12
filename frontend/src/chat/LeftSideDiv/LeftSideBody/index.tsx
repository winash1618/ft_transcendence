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
	conversations: any;
	UserProfilePicture: any;
}

const LeftSideBody = ({
	socket,
	Navbar,
	setNavbar,
	conversationID,
	conversations,
	UserProfilePicture,
}: LeftSideBodyProps) => {

	const [selectedConversationID, setSelectedConversationID] = useState(null);

	if (Navbar === Nav.DIRECT) {
		console.log("Direct 1");
		return (
			<DirectChat
				conversations={conversations}
				UserProfilePicture={UserProfilePicture}
				selectedConversationID={selectedConversationID}
				setSelectedConversationID={setSelectedConversationID}
			/>
		);
	} 
	else if (Navbar === Nav.GROUPS) {
		return (
			<GroupChat
				conversations={conversations}
				UserProfilePicture={UserProfilePicture}
				selectedConversationID={selectedConversationID}
				setSelectedConversationID={setSelectedConversationID}
			/>
		);
	} 
	else if (Navbar === Nav.EXPLORE) {
		return (
			<ExploreChat
				conversations={conversations}
				selectedConversationID={selectedConversationID}
				setSelectedConversationID={setSelectedConversationID}
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
