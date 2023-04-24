import { Nav } from "../chat.functions";
import DirectChatRelations from "./DirectChatRelations";
import GroupChatRelations from "./GroupChatRelations";

interface RightSideDivProps {
	socket: any;
	user: any;
	Navbar: Nav;
	conversationID: string;
	conversation: any;
	results: any;
	groupResults: any;
	setGroupResults: any;
	setGroupNav: any;
	groupNav: any;
}

const RightSideDiv = ({
	socket,
	user,
	Navbar,
	conversationID,
	conversation,
	results,
	groupResults,
	setGroupResults,
	setGroupNav,
	groupNav,

}: RightSideDivProps) => {
	if (Navbar === Nav.DIRECT) {
		return (
			<>
				<DirectChatRelations
				user={user}
				socket={socket}
				results={results}
				/>
			</>
		);
	}
	else if (Navbar === Nav.GROUPS) {
		return (
			<>
				<GroupChatRelations 
				socket={socket}
				conversationID = {conversationID}
				conversation = {conversation}
				groupResults = {groupResults}
				setGroupResults = {setGroupResults}
				setGroupNav = {setGroupNav}
				groupNav = {groupNav}
				/>
			</>
		);
	}
};

export default RightSideDiv;