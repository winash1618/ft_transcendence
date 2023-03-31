import React from "react";
import { MessageImage, MessageLeft, MessageLeftContainer, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv } from "./styles/MessageBox.styled";

interface MessageBoxProps {
	messages: any;
	messageEndRef: any;
	UserProfilePicture: any;
}

function MessageBox({ messages, messageEndRef, UserProfilePicture }: MessageBoxProps) {
	return (
		<>
			<MessageSendDiv>
				<MessageParent>
					{
						(
							messages.map((message) => {
								console.log("participant Id ", message.myParticipantID, "auther Id ", message.author_id, "   ", message.author_id === message.myParticipantID);
								if (message.author_id === message.myParticipantID) {
									return (
										<MessageRightContainer key={message.id}>
											<MessageRight>{message.content}</MessageRight>
											<MessageImage src={UserProfilePicture} alt="" />
										</MessageRightContainer>
									);
								} else {

									return (
										<MessageLeftContainer key={message.id}>
											<MessageImage src={UserProfilePicture} alt="" />
											<MessageLeft>{message.content}</MessageLeft>
										</MessageLeftContainer>
									);
								}
							})
						)}
					<div ref={messageEndRef} />
				</MessageParent>
			</MessageSendDiv>
		</>
	);
}

export default MessageBox;