import React from "react";
import { MessageInput, MessageInputParent, SendButton } from "./styles/InputBoxDiv.styled";

interface InputBoxDivProps {
	message: any;
	setMessage: any;
	handleSubmit: any;
}

function InputBoxDiv({ message, setMessage, handleSubmit }: InputBoxDivProps) {
	return (
		<>
			<MessageInputParent>
				<MessageInput
					type="text"
					placeholder="A bigger text input"
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

export default InputBoxDiv;
