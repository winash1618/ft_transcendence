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
	setSender: any;
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
	setSender,
} : LeftSideDivProps) => {
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
				setNavbar={setNavbar}
				conversations={conversations}
				conversationID={conversationID}
				setConversationID={setConversationID}
				UserProfilePicture={UserProfilePicture}
				setMessages={setMessages}
				setSender={setSender}
			/>
		</>
	);
};

export default LeftSideDiv;