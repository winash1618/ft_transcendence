
import React, { useState } from "react";
import { ContactDiv, ContactImage, ContactName, StyledTiLockClosed, StyledTiLockOpen } from "./styles/ChatListDiv.styled";
interface ChatListDivProps {
	conversations: any;
	conversationID: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleSelectedConversation: any;
	isInGroup: boolean;
}

const Privacy = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	PROTECTED: 'PROTECTED',
	DIRECT: 'DIRECT'
};

function ChatListDiv({ conversations, conversationID, contactDivColor, UserProfilePicture, handleSelectedConversation, isInGroup }: ChatListDivProps) {
	return (
		<>
			{
				conversations.map((c) => {
					if (c) {
						return (
							<React.Fragment key={c.id}>
								<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={conversationID === c.id ? contactDivColor : '#1A1D1F'}>
									<ContactImage src={UserProfilePicture} alt="" />
									{(isInGroup) ? (c.privacy === Privacy.PUBLIC) ?
										<>
											<ContactName>{c.title} <StyledTiLockOpen /> </ContactName>
										</>
										:
										<>
											<ContactName>{c.title} <StyledTiLockClosed /> </ContactName>
										</>
										:
										<ContactName>{c.user.login}</ContactName>}

								</ContactDiv>
							</React.Fragment>
						);
					}
				})
			}
		</>
	);
}

export default ChatListDiv;
