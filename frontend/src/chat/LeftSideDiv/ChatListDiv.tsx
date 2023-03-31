import React from "react";
import { ContactDiv, ContactImage, ContactName } from "./styles/ChatListDiv.styled";
interface ChatListDivProps {
	conversations: any;
	conversationID: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleSelectedConversation: any;
}
function ChatListDiv({ conversations, conversationID, contactDivColor, UserProfilePicture, handleSelectedConversation }: ChatListDivProps) {
	return (
		<>
			{
				conversations.map((c) => {
					return (
						<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={conversationID === c.id ? contactDivColor : '#1A1D1F'}>
							<ContactImage src={UserProfilePicture} alt="" />
							<ContactName>{c.title}</ContactName>
						</ContactDiv>
					);
				})
			}
		</>
	);
}

export default ChatListDiv;
