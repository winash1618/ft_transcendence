import React, { useState } from "react";
import { Colors, Nav, Privacy } from "../../chat.functions";
import { ContactDiv, ContactImage, ContactName } from "./LeftSideBody.styled";

interface GroupChatProps {
	socket: any;
	Navbar: Nav;
	conversations: any;
	UserProfilePicture: any;
	selectedConversationID: any;
	setSelectedConversationID: any;
}

const GroupChat = ({
	socket,
	Navbar,
	conversations,
	UserProfilePicture,
	selectedConversationID,
	setSelectedConversationID,
}: GroupChatProps) => {
	
	function handleSelectedConversation(conversation: any) {
		setSelectedConversationID(conversation.id);
	}
	return (
		<>
			{
				conversations.map((c) => {
					if (c) {
						return (
							<React.Fragment key={c.id}>
								<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={selectedConversationID === c.id ? Colors.SECONDARY : Colors.PRIMARY}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{c.title}{(c.privacy === Privacy.PUBLIC) ? (" (PUBLIC)") : (c.privacy === Privacy.PROTECTED) ? (" (PROTECTED)") : (c.privacy === Privacy.PRIVATE) ? (" (PRIVATE)") : null}</ContactName>
								</ContactDiv>
							</React.Fragment>
						);
					}
				})
			}
		</>
	);
};

export default GroupChat;