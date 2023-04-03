
import React, { useEffect } from "react";
import { useState } from "react";
import DropdownButtonDiv from "../components/DropDownButtonDiv";
import DropDownDiv from "../components/DropDownDiv";
import { ContactDiv, ContactImage, ContactName, Heading1, Heading2, StyledRiMailSettingsFill } from "./styles/GroupConversation.styled";
import { GiDwarfKing } from "react-icons/gi";
interface GroupConversationProps {
	groupMembers: any;
	otherUsers: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleAddUserToGroup: any;
	createDirectChat: any;
}

function GroupConversation({ groupMembers, otherUsers, user, contactDivColor, UserProfilePicture, handleAddUserToGroup, createDirectChat }: GroupConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);

	// useEffect(() => {
	// 	console.log("groupMembers: ", groupMembers);
	// 	console.log("otherUsers: ", otherUsers);
	// }, [groupMembers, otherUsers])
	return (
		<>
			<StyledRiMailSettingsFill size={24} />
			<Heading1>Group Chat </Heading1>
			<Heading2> Group Members </Heading2>
			{
				groupMembers.map((u) => {
					if (u.login !== user.login) {
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId}/>
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["Not yet", "help"]} createDirectChat={createDirectChat} />
							</React.Fragment>
						);
					}
					else if (u.login === user.login) {
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<GiDwarfKing size={24} />
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId}/>
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["Not yet", "help"]} createDirectChat={createDirectChat} />
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
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor} onClick={(e) => handleAddUserToGroup(e)}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId}/>
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["Not yet", "help"]} createDirectChat={createDirectChat} />
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