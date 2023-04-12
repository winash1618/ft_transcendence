import { useEffect, useState } from "react";
import { LeftSideContainer, ParentContainer } from "./chat.styled";
import LeftSideHeader from "./LeftSideDiv/LeftSideHeader/LeftSideHeader";
import { Nav } from "./chat.functions";
import LeftSideBody from "./LeftSideDiv/LeftSideBody";
import { UserProfilePicture } from "../assets";

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
					<LeftSideHeader
						user={user}
						socket={socket}
						Navbar={Navbar}
						setNavbar={setNavbar}
						setConversations={setConversations}
					/>
					<LeftSideBody
						user={user}
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