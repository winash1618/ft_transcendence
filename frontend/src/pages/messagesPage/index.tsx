import React, { useEffect, useRef, useState } from 'react';
import { ChatListContainer, SendButton, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav, ParentUserListDiv, UserListLabel, UserListInput, UserListLabelText, CreateConversationDiv, CreateChannelFormContainer, CreateChannelLabel, CreateChannelInput, CreateChannelSelect, CreateChannelOption, CreateChannelButton } from './messages.styled';
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
	const [myParticipantID, setMyParticipantID] = useState(null);
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [currentConversation, setCurrentConversation] = useState(null);
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
			socket?.on('availableUsers', (objectFull) => {
				setUsers(objectFull.ListOfAllUsers);
				setConversations(objectFull.conversations);
				setMyParticipantID(objectFull.myParticipantID);
				if (objectFull.conversations.length > 0) {
					handleOnLoadConversation(objectFull.conversations[0]);
				}
			});
			socket?.on('getDirectConversations', (object) => {
				setConversations(object.conversations);
				setMyParticipantID(object.myParticipantID);
				if (object.conversations.length > 0) {
					handleOnLoadConversation(object.conversations[0]);
				}
			});
			socket?.on('getGroupConversations', (object) => {
				setConversations(object.conversations);
				setMyParticipantID(object.myParticipantID);
				if (object.conversations.length > 0) {
					handleOnLoadConversation(object.conversations[0]);
				}
			});
			socket?.on('reloadConversations', (reloadObject) => {
				setMyParticipantID(reloadObject.myParticipantID);
				setConversations(reloadObject.conversations);
				setCurrentConversation(reloadObject.currentConversation);
			});
			socket?.on('sendMessage', (message) => {
				setMessages((messages) => [...messages, message]);
			});
		};
		getSocket();
	}, [dispatch]);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message.trim() !== "") {
			const newMessage = {
				id: Date.now(),
				author_id: "Set this to participant id",
				myParticipantID: myParticipantID,
				conversation_id: conversationID,
				content: message,
				type: "right",
			};
			// setMessages([...messages, newMessage]);
			socket?.emit('sendMessage', newMessage);
			setMessage("");
		}
		setIsFormVisible(false);
	};

	const handleMessageNavClick = () => {
		socket?.emit('getDirectConversations');
		setMessageNavButtonColor("#00A551");
		setMessageNavButtonColorNotUsed("#1A1D1F");
		setIsFormVisible(false);
	};

	const handleMessageNavNotUsedClick = () => {
		socket?.emit('getGroupConversations');
		setMessageNavButtonColor("#1A1D1F");
		setMessageNavButtonColorNotUsed("#00A551");
		setIsFormVisible(false);
	};
	
	const handleCreateConversationClick = () => {
		setIsFormVisible(true);
	};
	
	const handleSelectedConversation = async (conversation) => {
		socket?.emit('reloadConversations', conversation);
		console.log("conversation1111: ", conversation)
		setMessages([]);
		setMyParticipantID(conversation.participant_id);
		setConversationID(conversation.id);
		setContactDivColor("#00A551");
		conversation.messages.map((m) => {
			console.log("conversation.participant_id: ", conversation.participant_id, " author_id: ", m.author_id, conversation.participant_id === m.author_id);
			const newMessage = {
				id: m.id,
				author_id: m.author_id,
				myParticipantID: conversation.participant_id,
				content: m.message,
				type: "right",
			};
			setMessages((messages) => [...messages, newMessage]);
		});
		setIsFormVisible(false);
	};

	const handleOnLoadConversation = async (conversation) => {
		setMessages([]);
		setConversationID(conversation.id);
		setContactDivColor("#00A551");
		conversation.messages.map((m) => {
			console.log("conversation.participant_id: ", conversation.participant_id, " author_id: ", m.author_id, conversation.participant_id === m.author_id);
			const newMessage = {
				id: m.id,
				author_id: m.author_id,
				myParticipantID: conversation.participant_id,
				content: m.message,
				type: "right",
			};
			setMessages((messages) => [...messages, newMessage]);
		});
		setIsFormVisible(false);
	};

	// const handleSelectedConversation = async (conversation) => {
	// 	socket?.emit('reloadConversations', conversation);
	// 	setConversationID(conversation.id);
	// 	setContactDivColor("#00A551");
	// 	if ((currentConversation !== null) && (conversationID !== currentConversation.id)) {
	// 		setMessages([]);
	// 		currentConversation.messages.map((m) => {
	// 			const newMessage = {
	// 				id: m.id,
	// 				author_id: m.author_id,
	// 				content: m.message,
	// 				type: "right",
	// 			};
	// 			setMessages((messages) => [...messages, newMessage]);
	// 		});
	// 		setCurrentConversation(null);
	// 	}
	// 	setIsFormVisible(false);
	// };

	// const handleOnLoadConversation = async (conversation) => {
	// 	socket?.emit('reloadConversations', conversation);
	// 	setMessages([]);
	// 	setConversationID(conversation.id);
	// 	setContactDivColor("#00A551");
	// 	conversation.messages.map((m) => {
	// 		const newMessage = {
	// 			id: m.id,
	// 			author_id: m.author_id,
	// 			content: m.message,
	// 			type: "right",
	// 		};
	// 		setMessages((messages) => [...messages, newMessage]);
	// 	});
	// 	setIsFormVisible(false);
	// };

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
					<CreateConversationDiv backgroundColor='#1A1D1F' onClick={handleCreateConversationClick}>
						<BiCommentAdd size={24} />
						<ContactName>Create Conversation</ContactName>
					</CreateConversationDiv>
				</ChatListContainer>
				<MessageBox>
					<MessageSendDiv>
						<MessageParent>
							{
								(
									messages.map((message) => {
										console.log("participant Id ", message.myParticipantID, "auther Id ", message.author_id,"   ", message.author_id === message.myParticipantID);
										if (message.author_id === message.myParticipantID) {
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

					<h1>Channel Details</h1>
					{isFormVisible ? (
						<CreateChannelFormContainer>
							<CreateChannelLabel htmlFor="channel-name">Channel Name:</CreateChannelLabel>
							<CreateChannelInput type="text" id="channel-name" name="channel-name" required />
							<CreateChannelLabel htmlFor="channel-status">Channel Status:</CreateChannelLabel>
							<CreateChannelSelect id="channel-status" name="channel-status" required>
								<CreateChannelOption value="">Select status</CreateChannelOption>
								<CreateChannelOption value="private">Private</CreateChannelOption>
								<CreateChannelOption value="public">Public</CreateChannelOption>
								<CreateChannelOption value="protected">Protected</CreateChannelOption>
							</CreateChannelSelect>
							{/* <CreateChannelButton type="submit" onClick={handleChannelCreateSubmit}>Submit</CreateChannelButton> */}
						</CreateChannelFormContainer>
					) : (
						users.map((u) => {
							if (u.login !== user.login) {
								return (
									<ContactDiv key={u.login} backgroundColor={contactDivColor}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>{u.login}</ContactName>
									</ContactDiv>
								);
							}
							return null; // always provide a fallback for conditional rendering
						})
					)}
				</ParentUserListDiv>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
