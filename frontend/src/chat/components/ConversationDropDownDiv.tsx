import React from "react";

import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface ConversationDropDownDivProps {
	openMenuId: any;
	conversation: any;
	dropDownContent: any;
}

function ConversaionDropDownDiv({ openMenuId, conversation, dropDownContent }: ConversationDropDownDivProps) {
	const handleDropdown = (e, conversation) => {
		// if (e.target.innerText === "") {
		// 	createDirectChat(conversation);
		// }
	}
	return (
		<>
			<DropdownMenu>
				<DropdownContent open={openMenuId === conversation.id}>
					{dropDownContent.map((item) => (
						<DropdownItem key={item} onClick={(e) => handleDropdown(e, conversation)} >{item}</DropdownItem>
					))}
				</DropdownContent>
			</DropdownMenu>
		</>
	);
}



export default ConversaionDropDownDiv;