
import { ContactDiv, ContactImage, ContactName } from "./styles/ChatListDiv.styled";
interface ChatListDivProps {
	conversations: any;
	conversationID: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleSelectedConversation: any;
	isInGroup: boolean;
}
function ChatListDiv({ conversations, conversationID, contactDivColor, UserProfilePicture, handleSelectedConversation, isInGroup }: ChatListDivProps) {
	return (
		<>
			{
				conversations.map((c) => {
					// console.log("Is in group: ", isInGroup, " c: ", c);
					if (c) {
						return (
							<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={conversationID === c.id ? contactDivColor : '#1A1D1F'}>
								<ContactImage src={UserProfilePicture} alt="" />
								<ContactName>{(isInGroup) ? c.title : c.user.login}</ContactName>
							</ContactDiv>
						);
					}
				})
			}
		</>
	);
}

export default ChatListDiv;
