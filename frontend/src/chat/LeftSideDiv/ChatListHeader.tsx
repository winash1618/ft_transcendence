import React, { memo } from "react";
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { MessageNav, MessageNavNotUsed, ParentMessageNav, StyledBiCommentAdd } from "./styles/ChatListHeader.styled";
interface ChatListHeaderProps {
	handleMessageNavClick: any;
	handleMessageNavNotUsedClick: any;
	messageNavButtonColor: any;
	messageNavButtonColorNotUsed: any;
	handleCreateConversationClick: any;
}

function ChatListHeader({ handleMessageNavClick, handleMessageNavNotUsedClick, messageNavButtonColor, messageNavButtonColorNotUsed, handleCreateConversationClick }: ChatListHeaderProps) {
	return (
		<>
			<ParentMessageNav>
				<MessageNav onClick={handleMessageNavClick} backgroundColor={messageNavButtonColor}>
					<HiOutlineUser /> Inbox
				</MessageNav>
				<MessageNavNotUsed onClick={handleMessageNavNotUsedClick} backgroundColor={messageNavButtonColorNotUsed}>
					<HiOutlineUserGroup /> Groups
				</MessageNavNotUsed>
				<StyledBiCommentAdd onClick={handleCreateConversationClick}/>
			</ParentMessageNav>
		</>
	);
}

export default memo(ChatListHeader);