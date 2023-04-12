
import { MessageImage, MessageLeft, MessageLeftContainer, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv } from "../MessageDiv.styled";

interface MessageInboxProps {
	sender: any;
	user: any;
	messages: any;
	messageEndRef: any;
	UserProfilePicture: any;
}

function MessageInbox(
	{
		sender,
		user,
		messages,
		messageEndRef,
		UserProfilePicture,
	}: MessageInboxProps) {
	return (
		<>
			<MessageSendDiv>
				<MessageParent>
					{(
						messages.map((message) => {
							if (sender.id === user.id) {
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

export default MessageInbox;