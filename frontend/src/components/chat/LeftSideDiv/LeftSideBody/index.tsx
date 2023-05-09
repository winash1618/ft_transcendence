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
	setConversation: any;
	setStatus: any;
	conversation: any;
	setGroupResults: any;
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
	setConversation,
	setStatus,
	conversation,
	setGroupResults,
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
				socket={socket}
				conversations={conversations}
				setConversationID={setConversationID}
				conversationID={conversationID}
				setMessages={setMessages}
				setConversation={setConversation}
				setStatus={setStatus}
				conversation={conversation}
				setGroupResults={setGroupResults}
			/>
		);
	}
	else if (Navbar === Nav.EXPLORE) {
		return (
			<ExploreChat
				socket={socket}
				conversations={conversations}
				Navbar={Navbar}
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
