import { useEffect, useState } from "react";
import { LeftSideContainer, MessageBoxContainer, ParentContainer, RightSideContainer } from "./chat.styled";
import LeftSideHeader from "./LeftSideDiv/LeftSideHeader";
import { Nav } from "./chat.functions";
import LeftSideBody from "./LeftSideDiv/LeftSideBody";
import { UserProfilePicture } from "../assets";
import LeftSideDiv from "./LeftSideDiv";
import MessageDiv from "./MessageDiv";
import RightSideDiv from "./RightSideDiv";

interface ChatProps {
	socket: any;
	user: any;
}

const Chat = ({
	socket,
	user,
}: ChatProps) => {
	const [Navbar, setNavbar] = useState(Nav.DIRECT);
	const [conversationID, setConversationID] = useState(null);
	const [conversations, setConversations] = useState([]);
	const [messages, setMessages] = useState([]);
	const [sender, setSender] = useState({} as any);


	return (
		<>
			<ParentContainer>
				<LeftSideContainer>
					<LeftSideDiv
						user={user}
						socket={socket}
						Navbar={Navbar}
						setNavbar={setNavbar}
						conversations={conversations}
						conversationID={conversationID}
						setConversationID={setConversationID}
						UserProfilePicture={UserProfilePicture}
						setConversations={setConversations}
						setMessages={setMessages}
						setSender={setSender}
					/>
				</LeftSideContainer>
				<MessageBoxContainer>
					<MessageDiv
						user={user}
						socket={socket}
						messages={messages}
						setMessages={setMessages}
						conversationID={conversationID}
						sender={sender}
						setSender={setSender}
					/>
				</MessageBoxContainer>
				<RightSideContainer>
					<RightSideDiv 
						Navbar={Navbar}
					/>
				</RightSideContainer>
			</ParentContainer>
		</>
	);
};

export default Chat;