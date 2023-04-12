import { useEffect, useState } from "react";
import { LeftSideContainer, ParentContainer } from "./chat.styled";
import LeftSideHeader from "./LeftSideDiv/LeftSideHeader/LeftSideHeader";
import { Nav } from "./chat.functions";
import LeftSideBody from "./LeftSideDiv/LeftSideBody";
import { UserProfilePicture } from "../assets";

interface ChatProps {
	socket: any;
}

const Chat = ({
	socket,
}: ChatProps) => {
	const [Navbar, setNavbar] = useState(Nav.DIRECT);
	const [conversationID, setConversationID] = useState(null);
	const [conversations, setConversations] = useState([]);


	return (
		<>
			<ParentContainer>
				<LeftSideContainer>
					<LeftSideHeader
						socket={socket}
						Navbar={Navbar}
						setNavbar={setNavbar}
						setConversations={setConversations}
					/>
					<LeftSideBody
						socket={socket}
						Navbar={Navbar}
						conversationID={conversationID}
						UserProfilePicture={UserProfilePicture}
					/>
				</LeftSideContainer>
			</ParentContainer>
		</>
	);
};

export default Chat;