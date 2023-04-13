import React, { useEffect, useState } from "react";
import { ContactDiv, ContactImage, ContactName, DropdownField, StyledTiLockClosed, StyledTiLockOpen } from "./LeftSideBody.styled";
import { Nav, Privacy, Colors } from "../../chat.functions";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";

interface DirectChatProp {
	conversations: any;
	UserProfilePicture: any;
	setConversationID: any;
	setMessages: any;
	setSender: any;
}

const DirectChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	setMessages,
	setSender,
}: DirectChatProp) => {

	const dispatch = useAppDispatch();

	async function handleSelectedConversation(conversation: any) {
		setConversationID(conversation.id);
		const getToken = async () => {
			try {
				const response = await axios.get("http://localhost:3001/token", {
					withCredentials: true,
				});
				localStorage.setItem("auth", JSON.stringify(response.data));
				return response.data.token;
			} catch (err) {
				dispatch(logOut());
				window.location.reload();
				return null;
			}
		};

		const token = await getToken();
		try {
			const result = await axios.get(`http://localhost:3001/chat/${conversation.id}/Messages`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessages(result.data);
			setSender(result.data[0].sender);
		} catch (err) {
			console.log(err);
		}
	}
	if (conversations.length > 0) {
		console.log(conversations);
		return (
			<>
				{
					conversations.map((c) => {
						if (c) {
							return (
								<React.Fragment key={c.id}>
									<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={setConversationID === c.id ? Colors.SECONDARY : Colors.PRIMARY}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>{c.participants[0].user.username}</ContactName>
									</ContactDiv>
								</React.Fragment>
							);
						}
					})
				}
			</>
		);
	} else {
		return (null);
	}
}

export default DirectChat;