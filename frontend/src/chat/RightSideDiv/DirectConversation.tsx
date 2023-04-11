
import React, { useEffect, useState } from 'react';
import DropdownButtonDiv from '../components/DropDownButtonDiv';
import DropDownDiv from '../components/DropDownDiv';
import { ContactDiv, ContactImage, ContactName } from './styles/Conversation.styled';


interface DirectConversationProps {
	conversationID: any;
	users: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	createDirectChat: any;
	handleDirectBlock: any;
}

function DirectConversation(
	{
		conversationID,
		users,
		user,
		contactDivColor,
		UserProfilePicture,
		createDirectChat,
		handleDirectBlock,
	}: DirectConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);
	useEffect(() => {
		setOpenMenuId(null);
	}, [conversationID]);
	return (
		<>
			{
				users.map((u) => {
					if (u.login !== user.login) {
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv
										user={u}
										openMenuId={openMenuId}
										setOpenMenuId={setOpenMenuId}
									/>
								</ContactDiv>
								<DropDownDiv
									openMenuId={openMenuId}
									user={u}
									dropDownContent={["invite", "view profile", "chat", "block"]}
									createDirectChat={createDirectChat}
									handleLeaveChannel={null}
									handleNewPasswordSubmit={null}
									handleRemovePassword={null}
									handleMakeAdmin={null}
									handleBanUser={null}
									handleMuteUser={null}
									handleKickUser={null}
									handleDirectBlock={handleDirectBlock}
								/>
							</React.Fragment>
						);
					}
					return null; // always provide a fallback for conditional rendering
				})
			}
		</>
	);
};

export default DirectConversation;

