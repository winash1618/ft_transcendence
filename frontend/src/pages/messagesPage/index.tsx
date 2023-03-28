import React, { useEffect, useRef, useState } from 'react';
import { ChatListContainer, SendButton, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav, ParentUserListDiv, UserListLabel, UserListInput, UserListLabelText, CreateConversationDiv } from './messages.styled';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { BiCommentAdd } from 'react-icons/bi';
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
	const [conversations, setConversations] = useState([]);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [conversationID, setConversationID] = useState(null);
	const [messageNavButtonColor, setMessageNavButtonColor] = useState("#00A551");
	const [messageNavButtonColorNotUsed, setMessageNavButtonColorNotUsed] = useState("#1A1D1F");
	const [contactDivColor, setContactDivColor] = useState("#1A1D1F");
	const [myParticipntID, setMyParticipantID] = useState(null);
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
			setSocket(socket);
			socket?.on('message', (message) => {
				console.log(message);
				setMessages((messages) => [...messages, message]);
			});
			socket?.on('availableUsers', (objectFull) => {
				setUsers(objectFull.ListOfAllUsers);
				setConversations(objectFull.conversations);
				setMyParticipantID(objectFull.participant_id);
				handleSelectedConversation(objectFull.conversations[0]);
			});
			socket?.on('getTwoPeopleConversation', (twoPeopleConversations) => {
				setConversations(twoPeopleConversations);
				handleSelectedConversation(twoPeopleConversations[0]);
				
			});
			socket?.on('getManyPeopleConversation', (manyPeopleConversations) => {
				setConversations(manyPeopleConversations);
				console.log(conversations);
				handleSelectedConversation(manyPeopleConversations[0]);
			});
			socket?.on('reloadConversations', (conversation) => {
				setConversations(conversation);
				console.log("This is what is happending", conversation);
			});
			socket?.on('sendMessage', (message) => {
				console.log(message);
				setMessages((messages) => [...messages, message]);
			});
		};
		getSocket();
	}, [dispatch]);

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(message);
		if (message.trim() !== "") {
			const newMessage = {
				id: Date.now(),
				author_id: myParticipntID,
				conversation_id: conversationID,
				content: message,
				type: "right",
			};
			// setMessages([...messages, newMessage]);
			// console.log(newMessage);
			socket?.emit('sendMessage', newMessage);
			setMessage("");
		}
	};

	const handleMessageNavClick = () => {
			socket?.emit('getTwoPeopleConversation');
			setMessageNavButtonColor("#00A551");
			setMessageNavButtonColorNotUsed("#1A1D1F");
			
	};
	const handleMessageNavNotUsedClick = () => {
			socket?.emit('getManyPeopleConversation');
			setMessageNavButtonColor("#1A1D1F");
			setMessageNavButtonColorNotUsed("#00A551");
	};

	const handleSelectedConversation = async (conversation) => {
		socket?.emit('reloadConversations', conversations);
		setMessages([]);
		setConversationID(conversation.id);
		setContactDivColor("#00A551");
		conversation.messages.map((m) => {
			const newMessage = {
				id: m.id,
				author_id: m.author_id,
				content: m.message,
				type: "right",
			};
			setMessages((messages) => [...messages, newMessage]);
		});

	};



	return (
		<>
			<ParentContainer>
				<ChatListContainer>
					<ParentMessageNav>
						<MessageNav onClick={handleMessageNavClick} backgroundColor={messageNavButtonColor}>
							<HiOutlineUser /> Inbox
						</MessageNav>
						<MessageNavNotUsed onClick={handleMessageNavNotUsedClick} backgroundColor={messageNavButtonColorNotUsed}>
							<HiOutlineUserGroup /> Groups
						</MessageNavNotUsed>
					</ParentMessageNav>
					{
						conversations.map((c) => {
								return (
									<ContactDiv key={c.id} onClick={() => handleSelectedConversation(c)} backgroundColor={conversationID === c.id ? contactDivColor : '#1A1D1F'}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>{c.title}</ContactName>
									</ContactDiv>
								);
						})
					}
				</ChatListContainer>
				<MessageBox>
					<MessageSendDiv>
						<MessageParent>
							
						{
						(
							messages.map((message) => {
							if (message.author_id === myParticipntID) {
								return (
								<MessageRightContainer key={message.id}>
									<MessageRight>{message.content}</MessageRight>
									<MessageImage src={UserProfilePicture} alt="" />
								</MessageRightContainer>
								);
							} else {

								return (
								<MessageLeftContainer key={message.id}>
									<MessageImage src={UserProfilePicture} alt="" />
									<MessageLeft>{message.content}</MessageLeft>
								</MessageLeftContainer>
								);
							}
							})
						)}
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
									handleSubmit(event);
								}
							}}
						/>
						<SendButton type="submit" onClick={(e) => handleSubmit(e)} size={24} />
					</MessageInputParent>
				</MessageBox>
				<ParentUserListDiv>
					<CreateConversationDiv backgroundColor='#00A551'>
							<BiCommentAdd size={24}/> Create Conversation
					</CreateConversationDiv>
							<h1>Owner</h1>
					{
						users.map((u) => {
							if (u.login !== user.login) {
								return (
									// <ContactDiv key={u.login} backgroundColor={contactDivColor}>
									// 	<ContactImage src={UserProfilePicture} alt="" />
									// 	<ContactName>{u.login}</ContactName>
									// </ContactDiv>
									<UserListLabel>
										<UserListInput defaultChecked/>
										<UserListLabelText $mode="dark">{u.login}</UserListLabelText>
									</UserListLabel>
								);
							}
						})
					}
				</ParentUserListDiv>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
