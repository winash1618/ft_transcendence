
import React, { useEffect, useState } from "react";
import { Heading2 } from "../RightSideDiv/styles/Conversation.styled";
import { ContactDiv, ContactImage, ContactName, DropdownField, StyledTiLockClosed, StyledTiLockOpen } from "./styles/LeftsideDiv.styled";

enum Nav {
	INBOX,
	CHANNELS,
	EXPLORE,
	CREATE,
}
interface LeftSideDivProps {
	conversations: any;
	conversationID: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleParticipantState: any;
	isOnKick: boolean;
	handleUnKickUser: any;
	navBar: Nav;
}

const Privacy = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	PROTECTED: 'PROTECTED',
	DIRECT: 'DIRECT'
};

function LeftSideDiv(
	{
		conversations,
		conversationID,
		contactDivColor,
		UserProfilePicture,
		handleParticipantState,
		isOnKick,
		handleUnKickUser,
		navBar,
	}: LeftSideDivProps) {
	const [selectedConversationId, setSelectedConversationId] = useState(null);

	function handleConversations(conversation: any) {
		if (isOnKick) {
			setSelectedConversationId(conversation.id);
		}
		else {
			handleParticipantState(conversation);
		}
	}
	return (
		<>
			{
				conversations.map((c) => {
					if (c) {
						return (
							<React.Fragment key={c.id}>
								<ContactDiv key={c.id} onClick={() => handleConversations(c)} backgroundColor={conversationID === c.id ? contactDivColor : '#1A1D1F'}>
									<ContactImage src={UserProfilePicture} alt="" />
									{
										(navBar === Nav.CHANNELS) ?
											(c.privacy === Privacy.PUBLIC) ?
												<><ContactName>{c.title} <StyledTiLockOpen /> </ContactName></> :
												<><ContactName>{c.title} <StyledTiLockClosed /> </ContactName></> :
											<ContactName>{c.user.login}</ContactName>
									}
								</ContactDiv>
								{
									(selectedConversationId === c.id && isOnKick) ?
										<DropdownField>
											<button onClick={() => handleUnKickUser(c)}>Join</button>
										</DropdownField>
										: null
								}
							</React.Fragment>
						);
					}
				})
			}
		</>
	);

}

export default LeftSideDiv;
