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

const Status = {
	ACTIVE: 'ACTIVE',
	BANNED: 'BANNED',
	KICKED: 'KICKED',
	MUTED: 'MUTED',
};

enum Nav {
	INBOX,
	CHANNELS,
	EXPLORE,
	CREATE,
}

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
	// const [isInGroup, setIsInGroup] = useState(false);
	const [navBar, setNavBar] = useState(Nav.INBOX);
	const [groupMembers, setGroupMembers] = useState([]);
	const [otherUsers, setOtherUsers] = useState([]);
	const [participantID, setParticipantID] = useState(null);
	const [publicConversations, setPublicConversations] = useState([]);
	const [isInPublic, setIsInPublic] = useState(false);
	const [isOnMute, setIsOnMute] = useState(false);
	const [isOnKick, setIsOnKick] = useState(false);
	const [isOnBan, setIsOnBan] = useState(false);
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
			if (navBar === Nav.INBOX) {
			// if (!isInGroup) {
				setUsers(object.ListOfAllUsers); // ListOfAllUsers without the current user
				setConversations(object.conversations); // List of direct conversations for the current user
				if (object.conversations.length > 0) {
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
			if (object.conversations.length > 0) {
				handleOnLoadConversation(object.conversations[0]);
				setConversationID(object.conversations[0].id);
			}
			setIsFormVisible(false);
			// setIsInGroup(false);
			setNavBar(Nav.INBOX);
		};

		const handleGroupConversations = (object) => {
			setConversations(object.conversations);
			setGroupMembers(object.groupMembers);
			setOtherUsers(object.otherUsers);
			if (object.conversations.length > 0) {
				if (object.conversations[0].participant.status === Status.ACTIVE || object.conversations[0].participant.status === Status.MUTED) {
					for (const p of object.conversations[0].participants) {
						if (user && p.user_id === user.id) {
							setParticipantID(p.id);
						}
					}
					setConversationID(object.conversations[0].id);
				}
				handleParticipantState(object.conversations[0]);
			}
			else {
				setMessages([]);
			}
		};

		const handleReloadConversations = (object) => {
			console.log("handleReloadConversations: ", object);
			const conversation = object.conversation;
			setConversations(object.conversations);
			setGroupMembers(object.groupMembers);
			setOtherUsers(object.otherUsers);
			setMessages([]);
			setConversationID(conversation.id);
			setContactDivColor("#00A551");
			setParticipantID(conversation.participant_id);
			conversation.messages.map((m) => {
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

		const handleMessageReceived = (message) => {
			console.log("handleMessageReceived: ", message, "conversationID: ", conversationID);
			if (message.conversation_id === conversationID) {
				setMessages((messages) => [...messages, message]);
			}
		};

		const handleConversationCreated = (object) => {
			if (navBar === Nav.INBOX) {
			// if (isInGroup) {
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
			// setNavBar(Nav.EXPLORE);
		};

		const handleError = (error) => {
			handleAlertMessage(error);
		};

		const handleProtectedConversationJoined = (object) => {
			const conversation = publicConversations.filter((c) => c.id === object.id);
			setPublicConversations(publicConversations.filter((c) => c.id !== conversation[0].id));
		};

		const handleAlert = (alert) => {
			handleAlertMessage(alert);
		};

		const handleUserBanned = (user_id) => {
			if (user_id === user.id) {
				window.location.reload();
			}
		};

		const handleUserKicked = (user_id) => {
			if (user_id === user.id) {
				window.location.reload();
			}
		};

		const handleUserUnKicked = (user_id) => {
			window.location.reload();
		};

		const handleUserMuted = (user_id) => {
			if (user_id === user.id) {
				window.location.reload();
			}
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
		socket?.on('userBanned', handleUserBanned);
		socket?.on('userKicked', handleUserKicked);
		socket?.on('userMuted', handleUserMuted);
		socket?.on('userUnKicked', handleUserUnKicked);

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
			socket?.off('userBanned', handleUserBanned);
			socket?.off('userKicked', handleUserKicked);
			socket?.off('userMuted', handleUserMuted);
			socket?.off('userUnKicked', handleUserUnKicked);
		};
	}, [socket, user, conversationID, setUsers, setConversations, setGroupMembers, setOtherUsers, setMessages]);

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
		// setNavBar(Nav.INBOX);
		setIsOnBan(false);
		setIsOnKick(false);
		setIsOnMute(false);
		setConversations([]);
		setMessages([]);
		setParticipantID(null);
		socket?.emit('getDirectConversations');
		setMessageNavButtonColor("#00A551");
		setMessageNavButtonColorNotUsed("#1A1D1F");
	};

	const handleMessageNavNotUsedClick = () => {
		setIsInPublic(false);
		// setNavBar(Nav.CHANNELS);
		setIsFormVisible(false);
		setNavBar(Nav.CHANNELS);
		// setIsInGroup(true);
		setConversations([]);
		setMessages([]);
		setParticipantID(null);
		socket?.emit('getGroupConversations');
		setMessageNavButtonColor("#1A1D1F");
		setMessageNavButtonColorNotUsed("#00A551");
	};

	const handleCreateConversationClick = () => {
		setIsFormVisible(true);
	};

	const handleSelectedConversation = async (conversation) => {
		socket?.emit('reloadConversations', conversation);
	};

	const handleOnLoadConversation = async (conversation) => {
		setMessages([]);
		setConversationID(conversation.id);
		setContactDivColor("#00A551");
		setParticipantID(conversation.participant_id);
		conversation.messages.map((m) => {
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
		});
	}

	const createDirectChat = (user) => {
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
		socket?.emit('leaveConversation', { conversation_id: conversationID, participant_id: conversation[0].participant_id });
		if (conversations.length > 1) {
			setConversationID(conversations.filter((c) => c.id !== conversationID)[0].id);
			console.log("conversationID: ", conversationID);
		}
		setConversations(conversations.filter((c) => c.id !== conversationID));
		setGroupMembers([]);
		setOtherUsers([]);
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
		socket?.emit('joinProtectedConversation', { conversation_id: conversation.id, password: password });
	};

	const handleNewPasswordSubmit = (password) => {
		socket?.emit('changePassword', { conversation_id: conversationID, password: password });
	};

	const handleRemovePassword = () => {
		socket?.emit('removePassword', conversationID);
	};

	const handleMakeAdmin = (user) => {
		socket?.emit('makeAdmin', { conversation_id: conversationID, user_id: user.id });
	};

	const handleBanUser = (user) => {
		console.log("ban user: ", user);
		socket?.emit('banUser', { conversation_id: conversationID, user_id: user.id });
	};

	const handleKickUser = (user) => {
		console.log("kick user: ", user);
		socket?.emit('kickUser', { conversation_id: conversationID, user_id: user.id });
	};

	const handleMuteUser = (user) => {
		socket?.emit('muteUser', { conversation_id: conversationID, user_id: user.id });
	};

	const handleParticipantState = (conversation) => {
		console.log("This is happening because i am debugging");
		console.log("conversation for group: ", conversation);
		console.log("isOnBan: ", isOnBan, "isOnMute: ", isOnMute, "isOnKick: ", isOnKick);
		setIsOnBan(false);
		setIsOnMute(false);
		setIsOnKick(false);
		if (conversation.participant.conversation_status === Status.BANNED) {
			alert("You have been banned from this channel2");
			setIsOnBan(true);
		}
		else if (conversation.participant.conversation_status === Status.MUTED) {
			alert("You have been muted from this channel1");
			setIsOnMute(true);
			handleSelectedConversation(conversation);
		}
		else if (conversation.participant.conversation_status === Status.KICKED) {
			alert("You have been kicked from this channel1");
			setIsOnKick(true);
		}
		else {
			console.log("I am here");
			handleSelectedConversation(conversation);
		}
	};

	const handleUnKickUser = (conversation) => {
		socket?.emit('unKickUser', { conversation_id: conversation.id, participant_id: conversation.participant.id });
		setIsOnKick(false);
	};

	const handleDirectBlock = (user) => {
		let conversation_id = null;
		for (let i = 0; i < conversations.length; i++) {
			const c = conversations[i];
			for (let j = 0; j < c.participants.length; j++) {
				const p = c.participants[j];
				if (p.user_id === user.id) {
					conversation_id = c.id;
					break;
				}
			}
			if (conversation_id !== null) {
				break;
			}
		}
		console.log("conversationID: ", conversation_id, "user: ", user);
		socket?.emit('directBlock', { conversation_id: conversation_id, user_id: user.id });
	};

	// check if the expiration time of mute is passed in regular intervals
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		if (isOnMute) {
	// 			const conversation = conversations.filter((c) => c.id === conversationID);
	// 			if (conversation[0].participant.mute_expiration_time < new Date()) {
	// 				setIsOnMute(false);
	// 				socket.emit('unMuteUser', { conversation_id: conversationID, participant_id: conversation[0].participant.id })
	// 				alert("You have been unmuted from this channel");
	// 			}
	// 		}
	// 	}, 1000);
	// 	return () => clearInterval(interval);
	// }, [isOnMute]);

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
						// isInGroup={isInGroup}
						publicConversations={publicConversations}
						isInPublic={isInPublic}
						joinPublicConversation={joinPublicConversation}
						joinProtectedConversation={joinProtectedConversation}
						handleParticipantState={handleParticipantState}
						isOnKick={isOnKick}
						handleUnKickUser={handleUnKickUser}
						navBar={navBar}
					/>
				</ChatListContainer>
				<MessageBoxContainer>
					<MessageBox
						messages={messages}
						messageEndRef={messageEndRef}
						UserProfilePicture={UserProfilePicture}
						participantID={participantID}
						isOnBan={isOnBan}
						isOnKick={isOnKick}
					/>
					<InputBoxDiv
						message={message}
						setMessage={setMessage}
						handleSubmit={handleSubmit}
						setParticipantIdInInput={setParticipantIdInInput}
						isOnMute={isOnMute}
						isOnBan={isOnBan}
						isOnKick={isOnKick}
					/>
				</MessageBoxContainer>
				<RightSideDiv>
					{
						isFormVisible ? (
							<CreateChannelFormDiv
								handleChannelCreation={handleChannelCreation}
							/>
								) : (navBar === Nav.CHANNELS ? (
						// ) : (isInGroup ? (
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
								handleMakeAdmin={handleMakeAdmin}
								handleBanUser={handleBanUser}
								handleKickUser={handleKickUser}
								handleMuteUser={handleMuteUser}
								isOnBan={isOnBan}
								isOnKick={isOnKick}
							/>
						) : (
							<DirectConversation
								conversationID={conversationID}
								users={users}
								user={user}
								contactDivColor={contactDivColor}
								UserProfilePicture={UserProfilePicture}
								createDirectChat={createDirectChat}
								handleDirectBlock={handleDirectBlock}
							/>
						))
					}
				</RightSideDiv>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
