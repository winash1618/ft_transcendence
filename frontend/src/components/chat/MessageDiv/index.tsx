import { useCallback, useEffect, useRef, useState } from "react";
import MessageInbox from "./MessageInbox";
import MessageInput from "./MessageInput";
import { UserProfilePicture } from "../../../assets";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { axiosPrivate } from "../../../api";

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
}: MessageDivProps) => {
	const messageEndRef = useRef(null);
	const [message, setMessage] = useState("");
	const { userInfo } = useAppSelector((state) => state.auth);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message.trim() !== "") {
			const newMessage = {
				conversationID: conversationID,
				message: message,
			};
			socket?.emit('sendMessage', newMessage);
			setMessage("");
		}
	};

	const handleMessageCreated = useCallback((object) => {
		try {
			axiosPrivate.get(`/users/blockedUsers/${userInfo.id}`)
			.then(response => {
				if (response.status === 200) {
					const blockedUsers = response.data.filter((user) => user.id === object.author.user.id)
					if (blockedUsers.length === 0) {
						if (object.conversation_id === conversationID) {
							setMessages((messages) => [...messages, object]);
						}
					}
					else
					{
						if (object.conversation_id === conversationID) {
							object.message = "*******";
							setMessages((messages) => [...messages, object]);
						}
					}
				} else {
					window.location.href = '/error';
				}
			})
				.catch(error => {
					console.error('An error occurred:', error);
					window.location.href = '/error';
				});
		} catch (err) {
		}
	}, [conversationID, setMessages, userInfo]);

	useEffect(() => {
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