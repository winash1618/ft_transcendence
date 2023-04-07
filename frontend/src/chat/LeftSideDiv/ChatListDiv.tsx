
import React, { useState } from "react";
import { Heading2 } from "../RightSideDiv/styles/Conversation.styled";
import { ContactDiv, ContactImage, ContactName, DropdownField, StyledTiLockClosed, StyledTiLockOpen } from "./styles/ChatListDiv.styled";


interface ChatListDivProps {
	conversations: any;
	conversationID: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleSelectedConversation: any;
	isInGroup: boolean;
	publicConversations: any;
	isInPublic: boolean;
	joinPublicConversation: any;
	joinProtectedConversation: any;
}

const Privacy = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	PROTECTED: 'PROTECTED',
	DIRECT: 'DIRECT'
};

function ChatListDiv({ conversations, conversationID, contactDivColor, UserProfilePicture, handleSelectedConversation, isInGroup, publicConversations, isInPublic, joinPublicConversation, joinProtectedConversation }: ChatListDivProps) {
	const [isProtected, setIsProtected] = useState(false);
	const [selectedConversationId, setSelectedConversationId] = useState(null);
	const [password, setPassword] = useState('');

	function handlePublicConversationsClick(conversation: any) {
		if (conversation.privacy === Privacy.PUBLIC)
			joinPublicConversation(conversation);
		else if (conversation.privacy === Privacy.PROTECTED) {
			setSelectedConversationId(conversation.id);
			setIsProtected(true);
		}
	}
	const handlePasswordChange = (event) => {
		const value = event.target.value;
		setPassword(value);
	};

	if (!isInPublic) {
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

	} else {
		return (
			<>
				<Heading2> Channels Available </Heading2>
				{
					publicConversations.map((c) => {
						if (c) {
							return (
								<React.Fragment key={c.id}>
									<ContactDiv key={c.id} backgroundColor={"#1A1D1F"} onClick={() => handlePublicConversationsClick(c)}>
										<ContactImage src={UserProfilePicture} alt="" />
										{(c.privacy === Privacy.PUBLIC) ?
											<>
												<ContactName>{c.title} <StyledTiLockOpen /> </ContactName>
											</>
											:
											<>
												<ContactName>{c.title} <StyledTiLockClosed /> </ContactName>
											</>}
									</ContactDiv>
									{
										(selectedConversationId === c.id && isProtected) ?
											<DropdownField>
												<input
													type="password"
													placeholder="Password"
													value={password}
													onChange={handlePasswordChange}
													required
												/>
												<button onClick={() => joinProtectedConversation(c, password)}>Join</button>
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
}

export default ChatListDiv;
