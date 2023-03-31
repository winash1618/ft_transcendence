
import { MessageImage, MessageLeft, MessageLeftContainer, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv } from "./styles/MessageBox.styled";

interface MessageBoxProps {
	messages: any;
	messageEndRef: any;
	UserProfilePicture: any;
	participantID: any;
}

function MessageBox({ messages, messageEndRef, UserProfilePicture, participantID }: MessageBoxProps) {
	return (
		<>
			<MessageSendDiv>
				<MessageParent>
					{
						(
							messages.map((message) => {
								console.log("participant Id ", participantID, "auther Id ", message.author_id, "   ", message.author_id === message.myParticipantID);
								if (message.author_id === participantID) {
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