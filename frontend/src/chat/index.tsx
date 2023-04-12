import { useEffect, useState } from "react";
import { LeftSideContainer, ParentContainer } from "./chat.styled";
import LeftSideHeader from "./LeftSideDiv/LeftSideHeader";
import { Nav } from "./chat.functions";
import LeftSideBody from "./LeftSideDiv/LeftSideBody";
import { UserProfilePicture } from "../assets";
import LeftSideDiv from "./LeftSideDiv";

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
						UserProfilePicture={UserProfilePicture}
						setConversations={setConversations}
					/>
				</LeftSideContainer>
			</ParentContainer>
		</>
	);
};

export default Chat;