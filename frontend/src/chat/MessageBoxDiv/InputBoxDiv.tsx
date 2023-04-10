
import { MessageInput, MessageInputParent, SendButton } from "./styles/InputBoxDiv.styled";

interface InputBoxDivProps {
	message: any;
	setMessage: any;
	handleSubmit: any;
	setParticipantIdInInput: any;
	isOnMute: boolean;
}

function InputBoxDiv(
	{
		message,
		setMessage,
		handleSubmit,
		setParticipantIdInInput,
		isOnMute,
		
	}: InputBoxDivProps) {
	return (
		<>
			<MessageInputParent>
				<MessageInput
					type="text"
					placeholder="Enter your message..."
					value={message}
					onChange={(event) => setMessage((!isOnMute) ? event.target.value:'')}
					onClick={setParticipantIdInInput}
					onKeyDown={(!isOnMute) ? (event) => {
						if (event.key === 'Enter') {
							handleSubmit(event);
						}
					} : null}
				/>
				<SendButton type="submit" onClick={(!isOnMute)? (e) => handleSubmit(e) : null} size={24} />
			</MessageInputParent>
		</>
	);
}

export default InputBoxDiv;
