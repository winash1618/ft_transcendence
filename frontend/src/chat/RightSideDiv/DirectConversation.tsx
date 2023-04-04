
import React, { useState } from 'react';
import DropdownButtonDiv from '../components/DropDownButtonDiv';
import DropDownDiv from '../components/DropDownDiv';
import { ContactDiv, ContactImage, ContactName } from './styles/DirectConversation.styled';


interface DirectConversationProps {
	users: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	createDirectChat: any;
}

function DirectConversation({ users, user, contactDivColor, UserProfilePicture, createDirectChat }: DirectConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);
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
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["invite", "view profile", "chat", "block"]} createDirectChat={createDirectChat} />
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

