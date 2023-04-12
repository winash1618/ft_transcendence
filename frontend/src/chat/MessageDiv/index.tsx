import { useEffect, useRef, useState } from "react";
import MessageInbox from "./MessageInbox";
import MessageInput from "./MessageInput";
import { UserProfilePicture } from "../../assets";

interface MessageDivProps {
	user: any;
	socket: any;
	messages: any;
	setMessages: any;
	conversationID: any;
}

const MessageDiv = ({
	user,
	socket,
	messages,
	setMessages,
	conversationID,
} : MessageDivProps) => {
	const messageEndRef = useRef(null);
	const [message, setMessage] = useState("");
	const [sender, setSender] = useState({} as any);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message.trim() !== "") {
			const newMessage = {
				conversationID: conversationID,
				message: message,
			};
			socket?.emit('messageCreate', newMessage);
			setMessage("");
		}
	};


	useEffect(() => {
		const handleMessageCreated = (object) => {
			const { message } = object.message;
			setSender(object.sender);
			if (message.conversation_id === conversationID) {
				setMessages((messages) => [...messages, message]);
			}
		};
		socket?.on('messageCreated', handleMessageCreated);
		return () => {
			socket?.off('messageCreated', handleMessageCreated);
		};
	}, [messages]);

	useEffect(() => {
		messageEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	return (
		<>
			<MessageInbox
				sender={sender}
				user={user}
				messages={messages}
				messageEndRef={messageEndRef}
				UserProfilePicture={UserProfilePicture}
			/>
			<MessageInput
				message={message}
				setMessage={setMessage}
				handleSubmit={handleSubmit}
			/>
		</>
	);
};

export default MessageDiv;