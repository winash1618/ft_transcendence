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
	const [status, setStatus] = useState(Status.ACTIVE);

	return (
		<>
			<ParentContainer>
				<LeftSideContainer>
					<LeftSideDiv
						user={user}
						socket={socket}
						Navbar={Navbar}
						status={status}
						setNavbar={setNavbar}
						conversations={conversations}
						conversationID={conversationID}
						setConversationID={setConversationID}
						UserProfilePicture={UserProfilePicture}
						setConversations={setConversations}
						setMessages={setMessages}
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
						Navbar={Navbar}
					/>
				</RightSideContainer>
			</ParentContainer>
		</>
	);
};

export default Chat;