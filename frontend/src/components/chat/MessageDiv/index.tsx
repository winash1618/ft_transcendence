import { useCallback, useEffect, useRef, useState } from "react";
import MessageInbox from "./MessageInbox";
import MessageInput from "./MessageInput";
import { UserProfilePicture } from "../../../assets";
import { useAppSelector } from "../../../hooks/reduxHooks";

interface MessageDivProps {
	user: any;
	socket: any;
	messages: any;
	setMessages: any;
	conversationID: any;
	blockedUsers: any;
}

const MessageDiv = ({
	user,
	socket,
	messages,
	setMessages,
	conversationID,
	blockedUsers,
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

	const handleMessageCreated = useCallback((object) => {
		console.log("handleMessageCreated in MessageDiv", object.author.user.id, blockedUsers);
		blockedUsers.filter((user) => user.id === object.author.user.id)
		if (blockedUsers.length === 0) {
			if (object.conversation_id === conversationID) {
				setMessages((messages) => [...messages, object]);
			}
		}
	}, [conversationID, setMessages]);

	useEffect(() => {
		console.log("socket: ", socket);
		socket?.on('messageCreated', handleMessageCreated);
		return () => {
			socket?.off('messageCreated', handleMessageCreated);
		};
	}, [socket, handleMessageCreated]);

	useEffect(() => {
		messageEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	return (
		<>
			<MessageInbox
				userObject={user}
				messages={messages}
				messageEndRef={messageEndRef}
				UserProfilePicture={UserProfilePicture}
			/>
			{
				(conversationID !== null) && (
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