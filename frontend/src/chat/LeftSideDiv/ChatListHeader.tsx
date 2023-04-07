import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { MessageNav, MessageNavNotUsed, ParentMessageNav, StyledBiCommentAdd, StyledMdOutlineTravelExplore } from "./styles/ChatListHeader.styled";
interface ChatListHeaderProps {
	handleMessageNavClick: any;
	handleMessageNavNotUsedClick: any;
	messageNavButtonColor: any;
	messageNavButtonColorNotUsed: any;
	handleCreateConversationClick: any;
	handleExploreChannelsClick: any;
}

function ChatListHeader({ handleMessageNavClick, handleMessageNavNotUsedClick, messageNavButtonColor, messageNavButtonColorNotUsed, handleCreateConversationClick, handleExploreChannelsClick }: ChatListHeaderProps) {
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
				<StyledMdOutlineTravelExplore onClick={handleExploreChannelsClick}/>
			</ParentMessageNav>
		</>
	);
}

export default ChatListHeader;