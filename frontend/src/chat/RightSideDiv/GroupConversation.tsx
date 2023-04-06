
import React from "react";
import { useState } from "react";
import DropdownButtonDiv from "../components/DropDownButtonDiv";
import DropDownDiv from "../components/DropDownDiv";
import { ContactDiv, ContactImage, ContactName, Heading1, Heading2, StyledRiMailSettingsFill } from "./styles/Conversation.styled";
import { GiDwarfKing } from "react-icons/gi";
interface GroupConversationProps {
	groupMembers: any;
	otherUsers: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleAddUserToGroup: any;
	createDirectChat: any;
	Conversation: any;
	handleLeaveChannel: any;
}

const Role = {
	ADMIN: 'ADMIN',
	USER: 'USER'
};
function GroupConversation({ groupMembers, otherUsers, user, contactDivColor, UserProfilePicture, handleAddUserToGroup, createDirectChat, Conversation, handleLeaveChannel }: GroupConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);
	const handleChannelSettings = () => {

	}
	if (Conversation !== undefined) {
	return (
		<>
			<StyledRiMailSettingsFill size={24} onClick={handleChannelSettings}>
			</StyledRiMailSettingsFill>
			<Heading1>Group Chat </Heading1>
			<Heading2> Group Members </Heading2>
			{
				groupMembers.map((u) => {
					console.log("Conversation.participant.role: ", Conversation);
					if (u.login !== undefined && u.login !== user.login) {
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={contactDivColor}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									{(Conversation !== undefined && Conversation.participant.role === Role.ADMIN) ? <DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} /> : null}
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["Kick", "Ban", "Mute"]} createDirectChat={createDirectChat} handleLeaveChannel={handleLeaveChannel} />
							</React.Fragment>
						);
					}
					else if (u.login === user.login && Conversation !== undefined && Conversation.participant.role === Role.ADMIN) {
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={(Conversation.participant.role === Role.ADMIN) ? "#99dd00" : "#00A551"}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["Leave Channel", "Change Password", "Remove Password"]} createDirectChat={createDirectChat} handleLeaveChannel={handleLeaveChannel} />
							</React.Fragment>
						)
					}
					else if (u.login === user.login   && Conversation.participant.role === Role.USER) {
						return (
							<React.Fragment key={u.id}>
								<ContactDiv key={u.login} backgroundColor={(Conversation.participant.role === Role.ADMIN) ? "#99dd00" : "#00A551"}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{u.login}</ContactName>
									<DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />
								</ContactDiv>
								<DropDownDiv openMenuId={openMenuId} user={u} dropDownContent={["Leave Channel"]} createDirectChat={createDirectChat} handleLeaveChannel={handleLeaveChannel} />
							</React.Fragment>
						)
					}
					return null;
				})
			}
			{
				Conversation.participant.role === Role.ADMIN && (
					<>
						<Heading2> Other Users </Heading2>
						{
							otherUsers.map((u) => {
								if (u.login !== user.login) {
									return (
										<React.Fragment key={u.id}>
											<ContactDiv key={u.login} backgroundColor={contactDivColor} onClick={(e) => handleAddUserToGroup(e)}>
												<ContactImage src={UserProfilePicture} alt="" />
												<ContactName>{u.login}</ContactName>
											</ContactDiv>
										</React.Fragment>
									);
								}
								return null;
							})
						}
					</>
				)
			}
		</>
	);
		}
}

export default GroupConversation;