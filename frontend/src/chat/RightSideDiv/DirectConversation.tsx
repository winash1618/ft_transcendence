
import { ContactDiv, ContactImage, ContactName } from './styles/DirectConversation.styled';


interface DirectConversationProps {
	users: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
}

function DirectConversation({ users, user, contactDivColor, UserProfilePicture }: DirectConversationProps) {
	return (
		<>
			{
				users.map((u) => {
					if (u.login !== user.login) {
						return (
							<ContactDiv key={u.login} backgroundColor={contactDivColor}>
								<ContactImage src={UserProfilePicture} alt="" />
								<ContactName>{u.login}</ContactName>
							</ContactDiv>
						);
					}
					return null; // always provide a fallback for conditional rendering
				})
			}
		</>
	);
};

export default DirectConversation;

