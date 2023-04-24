import { useEffect, useRef, useState } from "react";
import MessageInbox from "./MessageInbox";
import MessageInput from "./MessageInput";
import { UserProfilePicture } from "../../../assets";
import { Status } from "../chat.functions";

interface MessageDivProps {
	user: any;
	status: any;
	socket: any;
	messages: any;
	setMessages: any;
	conversationID: any;
}

const MessageDiv = ({
	user,
	status,
	socket,
	messages,
	setMessages,
	conversationID,
}: MessageDivProps) => {
	const messageEndRef = useRef(null);
	const [message, setMessage] = useState("");

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message.trim() !== "") {
			const newMessage = {
				conversationID: conversationID,
				message: message,
			};
			console.log("newMessage: ", newMessage);
			socket?.emit('sendMessage', newMessage);
			setMessage("");
		}
	};

	useEffect(() => {
		const handleMessageCreated = (object) => {
			if (object.conversation_id === conversationID) {
				setMessages((messages) => [...messages, object]);
			}
		};
		socket?.on('messageCreated', handleMessageCreated);
		return () => {
			socket?.off('messageCreated', handleMessageCreated);
		};
	}, [socket, conversationID, setMessages]);

	useEffect(() => {
		messageEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	return (
		<>
			<MessageInbox
				user={user}
				messages={messages}
				messageEndRef={messageEndRef}
				UserProfilePicture={UserProfilePicture}
			/>
			{
				(conversationID !== null && status !== Status.MUTED) && (
					<MessageInput
						message={message}
						setMessage={setMessage}
						handleSubmit={handleSubmit}
					/>
				)
			}
		</>
	);
};

export default MessageDiv;