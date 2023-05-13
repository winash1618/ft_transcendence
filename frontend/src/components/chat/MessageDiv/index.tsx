import { useCallback, useEffect, useRef, useState } from "react";
import MessageInbox from "./MessageInbox";
import MessageInput from "./MessageInput";
import { UserProfilePicture } from "../../../assets";
import { useAppSelector } from "../../../hooks/reduxHooks";
import axios from "axios";
import { BASE_URL } from "../../../api";

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
	const { userInfo, token } = useAppSelector((state) => state.auth);

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
		try {
			axios.get(`${BASE_URL}/users/blockedUsers/${userInfo.id}`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then(response => {
				if (response.status === 200) {
					console.log('response blocked', response);
					console.log('Request succeeded!');
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
				});
		} catch (err) {
			console.log(err);
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