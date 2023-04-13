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
	sender: any;
	setSender: any;
}

const MessageDiv = ({
	user,
	socket,
	messages,
	setMessages,
	conversationID,
	sender,
	setSender,
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
			console.log("object: ", object);
			const message = object;
			console.log("message: ", message);
			setSender(object.sender);
			setMessages((messages) => [...messages, message]);
		};
		socket?.on('messageCreated', handleMessageCreated);
		return () => {
			socket?.off('messageCreated', handleMessageCreated);
		};
	}, [socket, message, conversationID]);

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