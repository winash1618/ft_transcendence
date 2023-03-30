import React, { useEffect, useRef, useState } from 'react';
import { ChatListContainer, SendButton, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav, ParentUserListDiv, UserListLabel, UserListInput, UserListLabelText, CreateConversationDiv, CreateChannelFormContainer, CreateChannelLabel, CreateChannelInput, CreateChannelSelect, CreateChannelOption, CreateChannelButton } from './messages.styled';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { BiCommentAdd } from 'react-icons/bi';
import { UserProfilePicture } from '../../assets';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { logOut, setUserInfo } from '../../store/authReducer';
import axios from '../../api';
import RightSideDivForDirectConversation from '../../chat/RightSideDiv/RightSideDivForDirectConversation';
import { setgroups } from 'process';

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
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [isInGroup, setIsInGroup] = useState(false);
	const [groupMembers, setGroupMembers] = useState([]);
	const [otherUsers, setOtherUsers] = useState([]);
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
			socket?.on('availableUsers', (object) => {
				setUsers(object.ListOfAllUsers);
				setConversations(object.conversations);
				if (object.conversations.length > 0) {
					handleOnLoadConversation(object.conversations[0]);
					setConversationID(object.conversations[0].id);
				}
			});
			socket?.on('getDirectConversations', (object) => {
				setConversations(object.conversations);
				if (object.conversations.length > 0) {
					handleOnLoadConversation(object.conversations[0]);
					setConversationID(object.conversations[0].id);
				}
			});
			socket?.on('getGroupConversations', (object) => {
				setConversations(object.conversations);
				setGroupMembers(object.groupMembers);
				setOtherUsers(object.otherUsers);
				if (object.conversations.length > 0) {
					handleOnLoadConversation(object.conversations[0]);
					setConversationID(object.conversations[0].id);
				}
			});
			socket?.on('reloadConversations', (object) => {
				setConversations(object.conversations);
				setGroupMembers(object.groupMembers);
				setOtherUsers(object.otherUsers);
			});
			socket?.on('sendMessage', (message) => {
				setMessages((messages) => [...messages, message]);
			});
			socket?.on('conversationCreated', (object) => {
				conversations.push(object.conversation);
			});
			socket?.on('userAddedToGroup', (object) => {
				setGroupMembers(object.groupMembers);
				setOtherUsers(object.otherUsers);
			});
		};
		getSocket();
	}, [dispatch]);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message.trim() !== "") {
			const newMessage = {
				id: Date.now(),
				author_id: "",
				myParticipantID: "",
				conversation_id: conversationID,
				content: message,
				type: "right",
			};
			console.log("newMessage: ", newMessage);
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
		setIsInGroup(false);
	};

	const handleMessageNavNotUsedClick = () => {
		socket?.emit('getGroupConversations');
		setMessageNavButtonColor("#1A1D1F");
		setMessageNavButtonColorNotUsed("#00A551");
		setIsFormVisible(false);
		setIsInGroup(true);
	};
	
	const handleCreateConversationClick = () => {
		setIsInGroup(false);
		setIsFormVisible(true);
	};
	
	const handleSelectedConversation = async (conversation) => {
		if (conversation.id !== conversationID)
		{
			socket?.emit('reloadConversations', conversation);
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
		}
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
	
	const handleChannelCreation = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target.form);
		// console.log("formData: ", event);

		const channelName = formData.get('channel-name');
		const selectedUser = formData.get('channel-status');
		// const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/conversations`, {
		// 	title: channelName,
		// 	participant_id: selectedUser,
		// });
		// console.log("response: ", response);
		// socket?.emit('getGroupConversations');
		socket?.emit('createConversation', {title: channelName, privacy: selectedUser});
		setIsFormVisible(false);
	};

	const handleAddUserToGroup = async (event) => {
		event.preventDefault();
		// const formData = new FormData(event.target);
		console.log(event.target.outerText);
		const selectedUser = event.target.outerText;
		// const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/conversations/${conversationID}/addUser`, {
		// 	user_id: selectedUser,
		// });
		// console.log("response: ", response);
		socket?.emit('addUserToGroup', {conversationId: conversationID, userLogin: selectedUser});
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
							<CreateChannelButton type="submit" onClick={(e) => handleChannelCreation(e)}>Submit</CreateChannelButton>
						</CreateChannelFormContainer>
					) : (isInGroup ? (
						<>
							<h1>Group Chat</h1>
							<h2> Group Owner </h2>
									<ContactDiv key={user.login} backgroundColor={contactDivColor}>
										<ContactImage src={UserProfilePicture} alt="" />
										<ContactName>{user.login}</ContactName>
									</ContactDiv>
							<h2> Group Members </h2>
								{groupMembers.map((u) => {
									if (u.login !== user.login) {
										return (
											<ContactDiv key={u.login} backgroundColor={contactDivColor}>
												<ContactImage src={UserProfilePicture} alt="" />
												<ContactName>{u.login}</ContactName>
											</ContactDiv>
										);
									}
									return null; // always provide a fallback for conditional rendering
								})}
							<h2> Other Users</h2>
							{otherUsers.map((u) => {
									if (u.login !== user.login) {
										return (
											<ContactDiv key={u.login} backgroundColor={contactDivColor} onClick={(e) => handleAddUserToGroup(e)}>
												<ContactImage src={UserProfilePicture} alt="" />
												<ContactName>{u.login}</ContactName>
											</ContactDiv>
										);
									}
									return null; // always provide a fallback for conditional rendering
								})}
						</>
						
					) : (
						<RightSideDivForDirectConversation users={users} user={user} contactDivColor={contactDivColor} UserProfilePicture={UserProfilePicture}/>
					))

				}
				</ParentUserListDiv>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
