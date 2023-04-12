import React from "react";
import { ContactDiv, ContactImage, ContactName } from "./LeftSideBody.styled";
import { Colors, Privacy } from "../../chat.functions";

interface ExploreChatProps {
	conversations: any;
	selectedConversationID: any;
	setSelectedConversationID: any;
}

const ExploreChat = ({
	conversations,
	selectedConversationID,
	setSelectedConversationID,
} : ExploreChatProps) => {

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

export default ExploreChat;