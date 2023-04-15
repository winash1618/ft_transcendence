import { Nav } from "../chat.functions";
import DirectChatRelations from "./DirectChatRelations";
import GroupChatRelations from "./GroupChatRelations";

interface RightSideDivProps {
	user: any;
	Navbar: Nav;
	conversationID: string;
}

const RightSideDiv = ({
	user,
	Navbar,
	conversationID,
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
				/>
			</>
		);
	}
};

export default RightSideDiv;