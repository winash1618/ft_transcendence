
import React, { useEffect } from "react";
import { useState } from "react";
import DropdownButtonDiv from "../components/DropDownButtonDiv";
import DropDownDiv from "../components/DropDownDiv";
import { ContactDiv, ContactImage, ContactName, Heading1, Heading2 } from "./styles/Conversation.styled";
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
	handleNewPasswordSubmit: any;
	handleRemovePassword: any;
	handleMakeAdmin: any;
	handleBanUser: any;
	handleMuteUser: any;
	handleKickUser: any;
	isOnBan: any;
	isOnKick: any;
}

const Role = {
	ADMIN: 'ADMIN',
	USER: 'USER'
};
function GroupConversation(
	{
		groupMembers,
		otherUsers,
		user,
		contactDivColor,
		UserProfilePicture,
		handleAddUserToGroup,
		createDirectChat,
		Conversation,
		handleLeaveChannel,
		handleNewPasswordSubmit,
		handleRemovePassword,
		handleMakeAdmin,
		handleBanUser,
		handleMuteUser,
		handleKickUser,
		isOnBan,
		isOnKick,
	}: GroupConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);

	useEffect(() => {
		setOpenMenuId(null);
	}, [Conversation]);

	if (Conversation !== undefined && !isOnBan && !isOnKick) {
		return (
			<>
				<Heading1>Group Chat </Heading1>
				<Heading2> Group Members </Heading2>
				{
					groupMembers.map((u) => {
						if (u.login !== undefined && u.login !== user.login) {
							return (
								<React.Fragment key={u.id}>
									<ContactDiv key={u.login} backgroundColor={contactDivColor}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>{u.login}</ContactName>
										{
											(Conversation !== undefined && Conversation.participant.role === Role.ADMIN) ?
												<DropdownButtonDiv user={u} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} /> :
												null
										}
									</ContactDiv>
									<DropDownDiv
										openMenuId={openMenuId}
										user={u}
										dropDownContent={(Conversation.creator_id === user.login)?["Make Admin", "Kick", "Ban", "Mute"]:["Kick", "Ban", "Mute"]}
										createDirectChat={createDirectChat}
										handleLeaveChannel={null}
										handleNewPasswordSubmit={null}
										handleRemovePassword={null}
										handleMakeAdmin={handleMakeAdmin}
										handleBanUser={handleBanUser}
										handleMuteUser={handleMuteUser}
										handleKickUser={handleKickUser}
									/>
								</React.Fragment>
							);
						}
						else if (u.login === user.login && Conversation !== undefined && Conversation.participant.role === Role.ADMIN && Conversation.creator_id === user.login) {
							if (Conversation.privacy === "PUBLIC") {
								return (
									<React.Fragment key={u.id}>
										<ContactDiv key={u.login} backgroundColor={(Conversation.participant.role === Role.ADMIN) ? "#99dd00" : "#00A551"}>
											<ContactImage src={UserProfilePicture} alt="" />
											<ContactName>
												{u.login}{(Conversation.participant.role === Role.ADMIN) ? (" (Owner)") : null}
											</ContactName>
											<DropdownButtonDiv
												user={u}
												openMenuId={openMenuId}
												setOpenMenuId={setOpenMenuId}
											/>
										</ContactDiv>
										<DropDownDiv
											openMenuId={openMenuId}
											user={u}
											dropDownContent={["Leave Channel", "Add Password"]}
											createDirectChat={createDirectChat}
											handleLeaveChannel={handleLeaveChannel}
											handleNewPasswordSubmit={handleNewPasswordSubmit}
											handleRemovePassword={handleRemovePassword}
											handleMakeAdmin={null}
											handleBanUser={null}
											handleMuteUser={null}
											handleKickUser={null}
										/>
									</React.Fragment>
								)
							}
							else {
								return (
									<React.Fragment key={u.id}>
										<ContactDiv key={u.login} backgroundColor={(Conversation.participant.role === Role.ADMIN) ? "#99dd00" : "#00A551"}>
											<ContactImage src={UserProfilePicture} alt="" />
											<ContactName>
												{u.login} {(Conversation.participant.role === Role.ADMIN) ? (" (Owner)") : null}
											</ContactName>
											<DropdownButtonDiv
												user={u}
												openMenuId={openMenuId}
												setOpenMenuId={setOpenMenuId}
											/>
										</ContactDiv>
										<DropDownDiv
											openMenuId={openMenuId}
											user={u}
											dropDownContent={["Leave Channel", "Change Password", "Remove Password"]}
											createDirectChat={createDirectChat}
											handleLeaveChannel={handleLeaveChannel}
											handleNewPasswordSubmit={handleNewPasswordSubmit}
											handleRemovePassword={handleRemovePassword}
											handleMakeAdmin={null}
											handleBanUser={null}
											handleMuteUser={null}
											handleKickUser={null}
										/>
									</React.Fragment>
								)
							}
						}
						else if (u.login === user.login) {
							return (
								<React.Fragment key={u.id}>
									<ContactDiv
										key={u.login}
										backgroundColor={(Conversation.participant.role === Role.ADMIN) ? "#99dd00" : "#00A551"}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>
											{u.login}{(Conversation.participant.role === Role.ADMIN) ? (" (Admin)") : (" (User)")}
										</ContactName>
										<DropdownButtonDiv
											user={u}
											openMenuId={openMenuId}
											setOpenMenuId={setOpenMenuId}
										/>
									</ContactDiv>
									<DropDownDiv
										openMenuId={openMenuId}
										user={u}
										dropDownContent={["Leave Channel"]}
										createDirectChat={createDirectChat}
										handleLeaveChannel={handleLeaveChannel}
										handleNewPasswordSubmit={handleNewPasswordSubmit}
										handleRemovePassword={null}
										handleMakeAdmin={null}
										handleBanUser={null}
										handleMuteUser={null}
										handleKickUser={null}
									/>
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
												<ContactDiv
													key={u.login}
													backgroundColor={contactDivColor}
													onClick={(e) => handleAddUserToGroup(e)}
												>
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