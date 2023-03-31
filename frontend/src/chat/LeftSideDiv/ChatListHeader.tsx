import React from "react";
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { MessageNav, MessageNavNotUsed, ParentMessageNav } from "./styles/TopNavForChat.styled";
interface ChatListHeaderProps {
	handleMessageNavClick: any;
	handleMessageNavNotUsedClick: any;
	messageNavButtonColor: any;
	messageNavButtonColorNotUsed: any;
}

function ChatListHeader({ handleMessageNavClick, handleMessageNavNotUsedClick, messageNavButtonColor, messageNavButtonColorNotUsed }: ChatListHeaderProps) {
	return (
		<>
			<ParentMessageNav>
				<MessageNav onClick={handleMessageNavClick} backgroundColor={messageNavButtonColor}>
					<HiOutlineUser /> Inbox
				</MessageNav>
				<MessageNavNotUsed onClick={handleMessageNavNotUsedClick} backgroundColor={messageNavButtonColorNotUsed}>
					<HiOutlineUserGroup /> Groups
				</MessageNavNotUsed>
			</ParentMessageNav>
		</>
	);
}

export default ChatListHeader;