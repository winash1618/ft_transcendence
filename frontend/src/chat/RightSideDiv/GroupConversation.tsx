
import React from "react";
import { useState } from "react";
import DropdownButtonDiv from "../components/DropDownButtonDiv";
import DropDownDiv from "../components/DropDownDiv";
import { ContactDiv, ContactImage, ContactName, Heading1, Heading2 } from "./styles/GroupConversation.styled";
import { GiDwarfKing } from "react-icons/gi";

interface GroupConversationProps {
	groupMembers: any;
	otherUsers: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleAddUserToGroup: any;
}

function GroupConversation({ groupMembers, otherUsers, user, contactDivColor, UserProfilePicture, handleAddUserToGroup }: GroupConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);
	const [isOpen, setIsOpen] = useState(false);


	return (
		<>
			<Heading1>Group Chat</Heading1>
			<Heading2> Group Members </Heading2>
			{
				groupMembers.map((u) => {
					if (u.login !== user.login) {
						console.log("key ", u.login);
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor} isOpen={isOpen}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setIsOpen={setIsOpen} setOpenMenuId={setOpenMenuId} />
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} />
							</React.Fragment>
						);
					}
					else if (u.login === user.login) {
						console.log("key ", u.login);
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor} isOpen={isOpen}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<GiDwarfKing size={24} />
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setIsOpen={setIsOpen} setOpenMenuId={setOpenMenuId} />
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} />
							</React.Fragment>
						)
					}
					return null;
				})
			}
			<Heading2> Other Users </Heading2>
			{
				otherUsers.map((u) => {
					if (u.login !== user.login) {
						console.log("key ", u.login);
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor} onClick={(e) => handleAddUserToGroup(e)} isOpen={isOpen}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setIsOpen={setIsOpen} setOpenMenuId={setOpenMenuId} />
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} />
							</React.Fragment>
						);
					}
					return null;
				})
			}
		</>
	);
}

export default GroupConversation;