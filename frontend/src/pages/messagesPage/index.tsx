import {
	useEffect,
	useRef,
	useState
} from 'react';
import {
	ChatListContainer,
	ParentContainer,
	RightSideDiv,
	MessageBoxContainer
} from './messages.styled';
import { UserProfilePicture } from '../../assets';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { logOut, setUserInfo } from '../../store/authReducer';
import axios from '../../api';
import DirectConversation from '../../chat/RightSideDiv/DirectConversation';
import GroupConversation from '../../chat/RightSideDiv/GroupConversation';
import ChatListHeader from '../../chat/LeftSideDiv/ChatListHeader';
import ChatListDiv from '../../chat/LeftSideDiv/ChatListDiv';
import MessageBox from '../../chat/MessageBoxDiv/MessageBox';
import InputBoxDiv from '../../chat/MessageBoxDiv/InputBoxDiv';
import CreateChannelFormDiv from '../../chat/RightSideDiv/CreateChannelFormDiv';

const MessagesPage = () => {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [conversations, setConversations] = useState([]);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [conversationID, setConversationID] = useState(null);
	const [messageNavButtonColor, setMessageNavButtonColor] = useState("#ffffff");
	const [messageNavButtonColorNotUsed, setMessageNavButtonColorNotUsed] = useState("#1A1D1F");
	const [contactDivColor, setContactDivColor] = useState("#1A1D1F");
	const [isFormVisible, setIsFormVisible] = useState(false);
	const [isInGroup, setIsInGroup] = useState(false);
	const [groupMembers, setGroupMembers] = useState([]);
	const [otherUsers, setOtherUsers] = useState([]);
	const [participantID, setParticipantID] = useState(null);
	const [publicConversations, setPublicConversations] = useState([]);
	const [isInPublic, setIsInPublic] = useState(false);
	const [isOnMute, setIsOnMute] = useState(false);
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
		};
		getSocket();
	}, [dispatch, setUser]);

	useEffect(() => {
		const handleAvailableUsers = (object) => {
			if (!isInGroup) {
				setUsers(object.ListOfAllUsers);
				setConversations(object.conversations);
				if (object.conversations.length > 0) {
					console.log("object.conversations: ", object.conversations);
					handleOnLoadConversation(object.conversations[0]);
					setConversationID(object.conversations[0].id);
					for (const p of object.conversations[0].participants) {
						if (p.user_id === user.id) {
							setParticipantID(p.id);
						}
					}
				}
			}
		};

		const handleDirectConversations = (object) => {
			setConversations(object.conversations);
			console.log("object.conversations123: ", object.conversations);
			if (object.conversations.length > 0) {
				handleOnLoadConversation(object.conversations[0]);
				setConversationID(object.conversations[0].id);
			}
			setIsFormVisible(false);
			setIsInGroup(false);
		};

		const handleGroupConversations = (object) => {
			setConversations(object.conversations);
			setGroupMembers(object.groupMembers);
			setOtherUsers(object.otherUsers);
			if (object.conversations.length > 0) {
				handleOnLoadConversation(object.conversations[0]);
				setConversationID(object.conversations[0].id);
				for (const p of object.conversations[0].participants) {
					if (user && p.user_id === user.id) {
						setParticipantID(p.id);
					}
				}
			}
		};

		const handleReloadConversations = (object) => {
			setConversations(object.conversations);
			setGroupMembers(object.groupMembers);
			setOtherUsers(object.otherUsers);
		};

		const handleMessageReceived = (message) => {
			setMessages((messages) => [...messages, message]);
		};

		const handleConversationCreated = (object) => {
			if (isInGroup) {
				console.log("I am here: ", object);
				setConversations((conversations) => [...conversations, object]);
			}
		};

		const handleUserAddedToGroup = (object) => {
			setGroupMembers(object.groupMembers);
			setOtherUsers(object.otherUsers);
		};
		const handleConversationsListed = (object) => {
			setPublicConversations(object);
			setIsInPublic(true);
		};

		const handleError = (error) => {
			handleAlertMessage(error);
		};

		const handleProtectedConversationJoined = (object) => {
			const conversation = publicConversations.filter((c) => c.id === object.id);
			console.log ("this is the conversation: ", conversation);
			setPublicConversations(publicConversations.filter((c) => c.id !== conversation[0].id));
		};

		const handleAlert = (alert) => {
			handleAlertMessage(alert);
		};

		socket?.on('availableUsers', handleAvailableUsers);
		socket?.on('getDirectConversations', handleDirectConversations);
		socket?.on('getGroupConversations', handleGroupConversations);
		socket?.on('reloadConversations', handleReloadConversations);
		socket?.on('sendMessage', handleMessageReceived);
		socket?.on('conversationCreated', handleConversationCreated);
		socket?.on('userAddedToGroup', handleUserAddedToGroup);
		socket?.on('ConversationsListed', handleConversationsListed);
		socket?.on('error', handleError);
		socket?.on('alert', handleAlert);
		socket?.on('protectedConversationJoined', handleProtectedConversationJoined);

		return () => {
			socket?.off('availableUsers', handleAvailableUsers);
			socket?.off('getDirectConversations', handleDirectConversations);
			socket?.off('getGroupConversations', handleGroupConversations);
			socket?.off('reloadConversations', handleReloadConversations);
			socket?.off('sendMessage', handleMessageReceived);
			socket?.off('conversationCreated', handleConversationCreated);
			socket?.off('userAddedToGroup', handleUserAddedToGroup);
			socket?.off('ConversationsListed', handleConversationsListed);
			socket?.off('error', handleError);
			socket?.off('alert', handleAlert);
			socket?.off('protectedConversationJoined', handleProtectedConversationJoined);
		};
	}, [socket, user, setUsers, setConversations, setGroupMembers, setOtherUsers, setMessages]);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (message.trim() !== "") {
			const newMessage = {
				id: Date.now(),
				author_id: "",
				myParticipantID: participantID,
				conversation_id: conversationID,
				content: message,
				type: "right",
			};
			socket?.emit('sendMessage', newMessage);
			setMessage("");
		}
		setIsFormVisible(false);
	};
	
	const handleAlertMessage = (message) => {
		alert(message);
	}

	const handleMessageNavClick = () => {
		setIsInPublic(false);
		socket?.emit('getDirectConversations');
		setMessageNavButtonColor("#ffffff");
		setMessageNavButtonColorNotUsed("#1A1D1F");
	};

	const handleMessageNavNotUsedClick = () => {
		setIsInPublic(false);
		setIsFormVisible(false);
		setIsInGroup(true);
		setConversations([]);
		socket?.emit('getGroupConversations');
		setMessageNavButtonColor("#1A1D1F");
		setMessageNavButtonColorNotUsed("#ffffff");
	};

	const handleCreateConversationClick = () => {
		setIsFormVisible(true);
	};

	

	const handleSelectedConversation = async (conversation) => {
		if (conversation.id !== conversationID) {
			socket?.emit('reloadConversations', conversation);
			setMessages([]);
			setConversationID(conversation.id);
			setContactDivColor("#00A551");
			setParticipantID(conversation.participant_id);
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
		setParticipantID(conversation.participant_id);
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

	const handleChannelCreation = async (event, password) => {
		event.preventDefault();
		const formData = new FormData(event.target.form);
		const channelName = formData.get('channel-name');
		const channelPrivacy = formData.get('channel-status');
		Boolean(String(channelName).trim())
			? socket?.emit('createConversation', { title: channelName, privacy: channelPrivacy, password: password })
			: alert("Please enter a channel name");
		setIsFormVisible(false);
	};

	const handleAddUserToGroup = async (event) => {
		event.preventDefault();
		const selectedUser = event.target.outerText;
		otherUsers.forEach((user) => {
			if (user.login === selectedUser) {
				setGroupMembers((groupMembers) => [...groupMembers, user]);
			}
			setOtherUsers((otherUsers) => otherUsers.filter((u) => u.login !== selectedUser));
		});
		socket?.emit('addUserToGroup', { conversationId: conversationID, userLogin: selectedUser });
	};

	const setParticipantIdInInput = () => {
		conversations.map((c) => {
			if (c.id === conversationID) {
				c.participants.map((p) => {
					if (p.user_id === user.id) {
						setParticipantID(p.id);
					}
				});
			}
		}
		);
	}

	const createDirectChat =  (user) => {
		let i = 0;
		conversations.map((c) => {
			c.participants.map((p) => {
				if (p.user_id === user.id) {
					i = 1;
				}
			});
		}
		);
		if (i === 0)
			socket?.emit('createDirectConversation', user);
		else
			alert("Conversation already exists");
	};

	const handleLeaveChannel = () => {
		const conversation = conversations.filter((c) => c.id === conversationID);
		socket?.emit('leaveConversation', {conversation_id: conversationID, participant_id: conversation[0].participant_id});
		if (conversations.length > 1)
		{
			setConversationID(conversations.filter((c) => c.id !== conversationID)[0].id);
			console.log("conversationID: ", conversationID);
		}
		setConversations(conversations.filter((c) => c.id !== conversationID));
		console.log("leave channel");
	};
	const handleExploreChannelsClick = () => {
		console.log("explore public channels");
		setPublicConversations([]);
		socket?.emit('ListConversations');
		setIsFormVisible(false);
	};

	const joinPublicConversation = (conversation) => {
		socket?.emit('joinPublicConversation', conversation.id);
		setPublicConversations(publicConversations.filter((c) => c.id !== conversation.id));
	};

	const joinProtectedConversation = (conversation, password) => {
		socket?.emit('joinProtectedConversation', {conversation_id: conversation.id, password: password});
		
	};

	const handleNewPasswordSubmit = (password) => {
		socket?.emit('changePassword', {conversation_id: conversationID, password: password});
	};


	const handleRemovePassword = () => {
		socket?.emit('removePassword', conversationID);
	};
	return (
		<>
			<ParentContainer>
				<ChatListContainer>
					<ChatListHeader
						handleMessageNavClick={handleMessageNavClick}
						handleMessageNavNotUsedClick={handleMessageNavNotUsedClick}
						messageNavButtonColor={messageNavButtonColor}
						messageNavButtonColorNotUsed={messageNavButtonColorNotUsed}
						handleCreateConversationClick={handleCreateConversationClick}
						handleExploreChannelsClick={handleExploreChannelsClick}
					/>
					<ChatListDiv
						conversations={conversations}
						conversationID={conversationID}
						contactDivColor={contactDivColor}
						UserProfilePicture={UserProfilePicture}
						handleSelectedConversation={handleSelectedConversation}
						isInGroup={isInGroup}
						publicConversations={publicConversations}
						isInPublic={isInPublic}
						joinPublicConversation={joinPublicConversation}
						joinProtectedConversation={joinProtectedConversation}
					/>
				</ChatListContainer>
				<MessageBoxContainer>
					<MessageBox
						messages={messages}
						messageEndRef={messageEndRef}
						UserProfilePicture={UserProfilePicture}
						participantID={participantID}
					/>
					<InputBoxDiv
						message={message}
						setMessage={setMessage}
						handleSubmit={handleSubmit}
						setParticipantIdInInput={setParticipantIdInInput}
					/>
				</MessageBoxContainer>
				<RightSideDiv>
					{
						isFormVisible ? (
							<CreateChannelFormDiv
								handleChannelCreation={handleChannelCreation}
							/>
						) : (isInGroup ? (
							<GroupConversation
								groupMembers={groupMembers}
								otherUsers={otherUsers}
								user={user}
								contactDivColor={contactDivColor}
								UserProfilePicture={UserProfilePicture}
								handleAddUserToGroup={handleAddUserToGroup}
								createDirectChat={createDirectChat}
								Conversation={
									conversations.filter((c) => c.id === conversationID)[0]
								}
								handleLeaveChannel={handleLeaveChannel}
								handleNewPasswordSubmit={handleNewPasswordSubmit}
								handleRemovePassword={handleRemovePassword}
							/>
						) : (
							<DirectConversation
								conversationID={conversationID}
								users={users}
								user={user}
								contactDivColor={contactDivColor}
								UserProfilePicture={UserProfilePicture}
								createDirectChat={createDirectChat}
							/>
						))
					}
				</RightSideDiv>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
