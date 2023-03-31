import { BiCommentAdd } from 'react-icons/bi';
import { ContactName, CreateConversationDiv } from "./styles/ChatListFooter.styled";

interface ChatListFooterProps {
	handleCreateConversationClick: any;
}

function ChatListFooter({ handleCreateConversationClick }: ChatListFooterProps) {
	return (
		<>
			<CreateConversationDiv backgroundColor='#1A1D1F' onClick={handleCreateConversationClick}>
				<BiCommentAdd size={24} />
				<ContactName>Create Conversation</ContactName>
			</CreateConversationDiv>
		</>
	);
}

export default ChatListFooter;
