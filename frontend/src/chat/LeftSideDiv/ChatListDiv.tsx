
import React, { useState } from "react";
import { Heading2 } from "../RightSideDiv/styles/Conversation.styled";
import { ContactDiv, ContactImage, ContactName, StyledTiLockClosed, StyledTiLockOpen } from "./styles/ChatListDiv.styled";
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
}

const Privacy = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	PROTECTED: 'PROTECTED',
	DIRECT: 'DIRECT'
};

function ChatListDiv({ conversations, conversationID, contactDivColor, UserProfilePicture, handleSelectedConversation, isInGroup, publicConversations, isInPublic, joinPublicConversation }: ChatListDivProps) {

	function handlePublicConversationsClick(conversation: any) {
		// alert("This is a public channel. You can join it by clicking the Join button.");
		joinPublicConversation(conversation);
	}
	
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
									<ContactName>{c.title} <StyledTiLockOpen /> </ContactName>
								</ContactDiv>
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
