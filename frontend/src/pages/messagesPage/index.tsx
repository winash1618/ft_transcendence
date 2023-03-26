import React, { useEffect, useRef, useState } from 'react';
import { ChatListContainer, SendButton, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav } from './messages.styled';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { UserProfilePicture } from '../../assets';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { logOut, setUserInfo } from '../../store/authReducer';
import axios from '../../api';

const MessagesPage = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [socket, setSocket] = useState<Socket | null>(null);
	const messageEndRef = useRef(null);
	const dispatch = useAppDispatch();
	useEffect(() => {
		messageEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	
	useEffect(() => {
		const getToken = async () => {
			try {
				const response = await axios.get("/token", {
					withCredentials: true,
				});
				// console.log(response.data);
				localStorage.setItem("auth", JSON.stringify(response.data));
				setUser(response.data.user);
				dispatch(setUserInfo(response.data.user));
				return response.data.token;
			} catch (err) {
				dispatch(logOut());
				window.location.reload();
				return null;
			}
		};
		const getSocket = async () => {
			const socket = io(process.env.REACT_APP_SOCKET_URL, {
				withCredentials: true,
				auth: async (cb) => {
					const token = await getToken();
					cb({
						token,
					});
				},
			});
		// const getConversationId = async () => {
		// 	try {
		// 		const response = await axios.get("/conversation/:id", {
		// 			withCredentials: true,
		// 		});
		// 		console.log("this is response.consversation", response.data);
		// 		dispatch(setUserInfo(response.data));
		// 		// setMessages(response.data);
		// 	} catch (err) {
		// 		console.log(err);
		// 	}
		// };
			setSocket(socket);
			socket?.on('message', (message) => {
				console.log(message);
			  setMessages((messages) => [...messages, message]);
			});
			socket?.on('conversationHistory', (users) => {
				setUsers(users);
			});
			socket?.on('sendMessage', (message) => {
				console.log(message);
			  setMessages((messages) => [...messages, message]);
			});
		};
		getSocket();
	}, [dispatch]);
	
	const handleSubmit = (event, side) => {
		event.preventDefault();
		console.log(message);
		if (message.trim() !== "") {
			const newMessage = {
				id: Date.now(),
				content: message,
				type: side,
			};
			// setMessages([...messages, newMessage]);
			// console.log(newMessage);
			socket?.emit('sendMessage', newMessage);
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

					{
						users.map((u) => {
							if (u.login !== user.login)
							{
								return (
									<ContactDiv key={u.login}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>{u.login}</ContactName>
									</ContactDiv>
								);
							}
					})
					}

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
