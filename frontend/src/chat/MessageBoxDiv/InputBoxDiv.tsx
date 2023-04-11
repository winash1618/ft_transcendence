
import { useEffect } from "react";
import { MessageInput, MessageInputParent, SendButton } from "./styles/InputBoxDiv.styled";

interface InputBoxDivProps {
	message: any;
	setMessage: any;
	handleSubmit: any;
	setParticipantIdInInput: any;
	isOnMute: boolean;
	isOnBan: boolean;
	isOnKick: boolean;
}

function InputBoxDiv(
	{
		message,
		setMessage,
		handleSubmit,
		setParticipantIdInInput,
		isOnMute,
		isOnBan,
		isOnKick
		
	}: InputBoxDivProps) {
	return (
		<>
			<MessageInputParent>
				<MessageInput
					type="text"
					placeholder="Enter your message..."
					value={message}
					onChange={(event) => setMessage((!isOnMute && !isOnBan && !isOnKick) ? event.target.value:'')}
					onClick={setParticipantIdInInput}
					onKeyDown={(!isOnMute && !isOnBan && !isOnKick) ? (event) => {
						if (event.key === 'Enter') {
							handleSubmit(event);
						}
					} : null}
				/>
				<SendButton type="submit" onClick={(!isOnMute && !isOnBan && !isOnKick)? (e) => handleSubmit(e) : null} size={24} />
			</MessageInputParent>
		</>
	);
}

export default InputBoxDiv;
