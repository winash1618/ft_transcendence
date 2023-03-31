
import { ContactDiv, ContactImage, ContactName } from "./styles/GroupConversation.styled";

interface GroupConversationProps {
	groupMembers: any;
	otherUsers: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleAddUserToGroup: any;

}

function GroupConversation({ groupMembers, otherUsers, user, contactDivColor, UserProfilePicture, handleAddUserToGroup }: GroupConversationProps) {
	return (
		<>
			<h1>Group Chat</h1>
			<h2> Group Owner </h2>
			<ContactDiv key={user.login} backgroundColor={contactDivColor}>
				<ContactImage src={UserProfilePicture} alt="" />
				<ContactName>{user.login}</ContactName>
			</ContactDiv>
			<h2> Group Members </h2>
			{groupMembers.map((u) => {
				if (u.login !== user.login) {
					return (
						<ContactDiv key={u.login} backgroundColor={contactDivColor}>
							<ContactImage src={UserProfilePicture} alt="" />
							<ContactName>{u.login}</ContactName>
						</ContactDiv>
					);
				}
				return null; // always provide a fallback for conditional rendering
			})}
			<h2> Other Users</h2>
			{otherUsers.map((u) => {
				if (u.login !== user.login) {
					return (
						<ContactDiv key={u.login} backgroundColor={contactDivColor} onClick={(e) => handleAddUserToGroup(e)}>
							<ContactImage src={UserProfilePicture} alt="" />
							<ContactName>{u.login}</ContactName>
						</ContactDiv>
					);
				}
				return null; // always provide a fallback for conditional rendering
			})}
		</>
	);
}

export default GroupConversation;