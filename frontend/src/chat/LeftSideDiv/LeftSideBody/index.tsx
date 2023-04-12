import { useEffect, useState } from "react";
import { Nav } from "../../chat.functions";
import DirectChat from "./DirectChat";
import GroupChat from "./GroupChat";

interface LeftSideBodyProps {
	user: any;
	socket: any;
	Navbar: Nav;
	conversationID: any;
	conversations: any;
	UserProfilePicture: any;
}

const LeftSideBody = ({
	user,
	socket,
	Navbar,
	conversationID,
	conversations,
	UserProfilePicture,
}: LeftSideBodyProps) => {

	const [selectedConversationID, setSelectedConversationID] = useState(null);

	if (Navbar === Nav.DIRECT) {
		console.log("Direct 1");
		return (
			<DirectChat
				socket={socket}
				Navbar={Navbar}
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
				socket={socket}
				Navbar={Navbar}
				conversations={conversations}
				UserProfilePicture={UserProfilePicture}
				selectedConversationID={selectedConversationID}
				setSelectedConversationID={setSelectedConversationID}
			/>
		);
	} 
	// else if (Navbar === Nav.EXPLORE) {
	// 	return (
	// 		<ExploreChat
	// 			socket={socket}
	// 		/>
	// 	);
	// } else if (Navbar === Nav.CREATE) {
	// 	return (
	// 		<CreateChat
	// 			socket={socket}
	// 		/>
	// 	);
	// }
};

export default LeftSideBody;
