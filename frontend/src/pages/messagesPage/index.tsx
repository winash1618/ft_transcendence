import React, { useEffect, useRef, useState } from 'react';
import { ChatListContainer, SendButton, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav } from './messages.styled';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { UserProfilePicture } from '../../assets';

const MessagesPage = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const messageEndRef = useRef(null);
	useEffect(() => {
		messageEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSubmit = (event, side) => {
		event.preventDefault();
		console.log(message);
		if (message.trim() !== "") {
			const newMessage = {
				id: Date.now(),
				content: message,
				type: side,
			};
			setMessages([...messages, newMessage]);
			console.log(newMessage);
			setMessage("");
		}
	};
	return (
		<>
			<ParentContainer>
				<ChatListContainer>
					<ParentMessageNav>
						<MessageNav>
							<HiOutlineUser /> Inbox
						</MessageNav>
						<MessageNavNotUsed>
							<HiOutlineUserGroup /> Groups
						</MessageNavNotUsed>
					</ParentMessageNav>

					<ContactDiv>
						<ContactImage src={UserProfilePicture} />
						<ContactName>
							John Doe
						</ContactName>
					</ContactDiv>

				</ChatListContainer>
				<MessageBox>
					<MessageSendDiv>
						<MessageParent>
							{messages.map((message) => {
								if (message.type === "right") {
									return (
										<MessageRightContainer key={message.id}>
											<MessageRight>{message.content}</MessageRight>
											<MessageImage src={UserProfilePicture} alt="" />
										</MessageRightContainer>
									);
								} else if (message.type === "left") {
									return (
										<MessageLeftContainer key={message.id}>
											<MessageImage src={UserProfilePicture} alt="" />
											<MessageLeft>{message.content}</MessageLeft>
										</MessageLeftContainer>
									);
								}
							})}
							<div ref={messageEndRef} />
						</MessageParent>
					</MessageSendDiv>
					<MessageInputParent>
						<MessageInput
							type="text"
							placeholder="A bigger text input"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									handleSubmit(event, "left");
								}
							}}
						/>
						<SendButton type="submit" onClick={(e) => handleSubmit(e, "right")} size={24} />
					</MessageInputParent>
				</MessageBox>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
