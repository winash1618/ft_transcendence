import { Nav } from "../chat.functions";
import DirectChatRelations from "./DirectChatRelations";
import GroupChatRelations from "./GroupChatRelations";

interface RightSideDivProps {
	Navbar: Nav;
}

const RightSideDiv = ({
	Navbar,
}: RightSideDivProps) => {
	if (Navbar === Nav.DIRECT) {
		return (
			<>
				<DirectChatRelations
				/>
			</>
		);
	}
	else if (Navbar === Nav.GROUPS) {
		return (
			<>
				<GroupChatRelations
				/>
			</>
		);
	}
};

export default RightSideDiv;