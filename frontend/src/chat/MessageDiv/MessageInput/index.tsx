
import { useEffect } from "react";
import { Input, MessageInputParent, SendButton } from "../MessageDiv.styled";

interface MessageInputProps {
	message: any;
	setMessage: any;
	handleSubmit: any;
}

function MessageInput(
	{
		message,
		setMessage,
		handleSubmit,
	}: MessageInputProps) {
	return (
		<>
			<MessageInputParent>
				<Input
					type="text"
					placeholder="Enter your message..."
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleSubmit(event);
						}
					}}
				/>
				<SendButton type="submit" onClick={(e) => handleSubmit(e)} size={24} />
			</MessageInputParent>
		</>
	);
}

export default MessageInput;
