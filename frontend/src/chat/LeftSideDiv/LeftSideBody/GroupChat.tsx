import React, { useState } from "react";
import { Colors, Nav, Privacy } from "../../chat.functions";
import { ContactDiv, ContactImage, ContactName } from "./LeftSideBody.styled";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";

interface GroupChatProps {
	conversations: any;
	UserProfilePicture: any;
	setConversationID: any;
	setMessages: any;
}

const GroupChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	setMessages,
}: GroupChatProps) => {

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
		  const result = await axios.get(`http://localhost:3001/${conversation.id}/Messages`, {
			withCredentials: true,
			headers: {
			  Authorization: `Bearer ${token}`,
			},
		  });
		  setMessages(result.data);
		} catch (err) {
		  console.log(err);
		}
	  }
	  
	return (
		<>
			{
				conversations.map((c) => {
					if (c) {
						return (
							<React.Fragment key={c.id}>
								<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={setConversationID === c.id ? Colors.SECONDARY : Colors.PRIMARY}>
									<ContactImage src={UserProfilePicture} alt="" />
									<ContactName>{c.title}{(c.privacy === Privacy.PUBLIC) ? (" (PUBLIC)") : (c.privacy === Privacy.PROTECTED) ? (" (PROTECTED)") : (c.privacy === Privacy.PRIVATE) ? (" (PRIVATE)") : null}</ContactName>
								</ContactDiv>
							</React.Fragment>
						);
					}
				})
			}
		</>
	);
};

export default GroupChat;