
import React, { useState } from "react";
import ConversationDropdownButtonDiv from "../components/ConversationDropDownButtonDiv";
import ConversaionDropDownDiv from "../components/ConversationDropDownDiv";
import { ContactDiv, ContactImage, ContactName } from "./styles/ChatListDiv.styled";
interface ChatListDivProps {
	conversations: any;
	conversationID: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleSelectedConversation: any;
	isInGroup: boolean;
}
function ChatListDiv({ conversations, conversationID, contactDivColor, UserProfilePicture, handleSelectedConversation, isInGroup }: ChatListDivProps) {
	const [openMenuId, setOpenMenuId] = useState(null);
	return (
		<>
			{
				conversations.map((c) => {
					if (c) {
						return (
							<React.Fragment key={c.id}>
								<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={conversationID === c.id ? contactDivColor : '#1A1D1F'}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{(isInGroup) ? c.title : c.user.login}</ContactName>
									<ConversationDropdownButtonDiv
										conversation={c}
										openMenuId={openMenuId}
										setOpenMenuId={setOpenMenuId}
									/>
								</ContactDiv>
								<ConversaionDropDownDiv openMenuId={openMenuId} conversation={c} dropDownContent={["invite", "view profile", "chat"]} />
							</React.Fragment>
						);
					}
				})
			}
		</>
	);
}

export default ChatListDiv;
