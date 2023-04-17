import { useState } from "react";
import { LeftSideContainer, MessageBoxContainer, ParentContainer, RightSideContainer } from "./chat.styled";
import { Nav, Status } from "./chat.functions";
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
	const [status, setStatus] = useState(Status.ACTIVE); // you need to set this for if you are selecting any conversation in group 
	const [conversation, setConversation] = useState(null);

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
						setConversation={setConversation}
						setStatus={setStatus}
						conversation={conversation}
					/>
				</LeftSideContainer>
				<MessageBoxContainer>
					{(status === Status.ACTIVE || status === Status.MUTED) && (
						<MessageDiv
							user={user}
							status={status}
							socket={socket}
							messages={messages}
							setMessages={setMessages}
							conversationID={conversationID}
						/>
					)}
				</MessageBoxContainer>
				<RightSideContainer>
					<RightSideDiv 
						socket={socket}
						user={user}
						Navbar={Navbar}
						conversationID={conversationID}
						conversation={conversation}
					/>
				</RightSideContainer>
			</ParentContainer>
		</>
	);
};

export default Chat;