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
import ChatListFooter from '../../chat/LeftSideDiv/ChatListFooter';
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
		if (conversation.id !== conversationID) {
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
		const channelName = formData.get('channel-name');
		const selectedUser = formData.get('channel-status');
		socket?.emit('createConversation', { title: channelName, privacy: selectedUser });
		setIsFormVisible(false);
	};

	const handleAddUserToGroup = async (event) => {
		event.preventDefault();
		const selectedUser = event.target.outerText;
		socket?.emit('addUserToGroup', { conversationId: conversationID, userLogin: selectedUser });
	};

	return (
		<>
			<ParentContainer>
				<ChatListContainer>
					<ChatListHeader handleMessageNavClick={handleMessageNavClick} handleMessageNavNotUsedClick={handleMessageNavNotUsedClick} messageNavButtonColor={messageNavButtonColor} messageNavButtonColorNotUsed={messageNavButtonColorNotUsed} />
					<ChatListDiv conversations={conversations} conversationID={conversationID} contactDivColor={contactDivColor} UserProfilePicture={UserProfilePicture} handleSelectedConversation={handleSelectedConversation} />
					<ChatListFooter handleCreateConversationClick={handleCreateConversationClick} />
				</ChatListContainer>
				<MessageBoxContainer>
					<MessageBox messages={messages} messageEndRef={messageEndRef} UserProfilePicture={UserProfilePicture} />
					<InputBoxDiv message={message} setMessage={setMessage} handleSubmit={handleSubmit} />
				</MessageBoxContainer>
				<RightSideDiv>
					{isFormVisible ? (
						<CreateChannelFormDiv handleChannelCreation={handleChannelCreation} />
					) : (isInGroup ? (
						<GroupConversation groupMembers={groupMembers} otherUsers={otherUsers} user={user} contactDivColor={contactDivColor} UserProfilePicture={UserProfilePicture} handleAddUserToGroup={handleAddUserToGroup} />

					) : (
						<DirectConversation users={users} user={user} contactDivColor={contactDivColor} UserProfilePicture={UserProfilePicture} />
					))

					}
				</RightSideDiv>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
