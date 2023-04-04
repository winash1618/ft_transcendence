import React from "react";
import { IoIosArrowDropdownCircle, IoIosArrowDropdown } from "react-icons/io";
import { DropdownButton } from "./styles/DropDownButton.styled";


interface ConversationDropdownButtonDivProps {
	conversation: any;
	openMenuId: any;
	setOpenMenuId: any;
}

function ConversationDropdownButtonDiv({ conversation, openMenuId, setOpenMenuId }: ConversationDropdownButtonDivProps) {

	const toggleMenu = (id) => {
		setOpenMenuId(openMenuId === id ? null : id);
	};
	return (
		<>
			<DropdownButton onClick={() => toggleMenu(conversation.id)}> {openMenuId === conversation.id ? (
				<IoIosArrowDropdown size={24} />
			) : (
				<IoIosArrowDropdownCircle size={24} />
			)}</DropdownButton>
		</>
	);
}

export default ConversationDropdownButtonDiv;