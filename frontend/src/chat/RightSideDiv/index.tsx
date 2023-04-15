import { Nav } from "../chat.functions";
import DirectChatRelations from "./DirectChatRelations";
import GroupChatRelations from "./GroupChatRelations";

interface RightSideDivProps {
	user: any;
	Navbar: Nav;
	conversationID: string;
	conversation: any;
}

const RightSideDiv = ({
	user,
	Navbar,
	conversationID,
	conversation,

}: RightSideDivProps) => {
	if (Navbar === Nav.DIRECT) {
		return (
			<>
				<DirectChatRelations
				user={user}
				/>
			</>
		);
	}
	else if (Navbar === Nav.GROUPS) {
		return (
			<>
				<GroupChatRelations 
				conversationID = {conversationID}
				conversation = {conversation}
				/>
			</>
		);
	}
};

export default RightSideDiv;