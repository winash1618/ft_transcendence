import { useCallback, useEffect, useState } from "react";
import { Nav, Colors, Conversation } from "../../chat.functions";
import axios from "axios";
import { List, Input } from 'antd';
import { Picture } from "../../chat.styled";
import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import { logOut } from "../../../../store/authReducer";
import { BASE_URL } from "../../../../api";

interface DirectChatProp {
	conversations: Conversation[];
	UserProfilePicture: any;
	setConversationID: any;
	conversationID: any;
	setConversations: any;
	setMessages: any;
	socket: any;
	Navbar: Nav;
}

const DirectChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	conversationID,
	setConversations,
	setMessages,
	socket,
	Navbar,
}: DirectChatProp) => {
	const [searchText, setSearchText] = useState("");
	const { userInfo, token } = useAppSelector((state) => state.auth);

	const resetState = useCallback(() => {
		console.log("handleConversationLeft in DirectChat");
		setMessages([]);
		setConversationID(null);
	}, [setMessages, setConversationID]);
	useEffect(() => {
		console.log("i am in direct useEffect");
		resetState();
	}, [conversations, resetState]);

	const filterResults = (data: Conversation[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
	};

	const handleDirectExists = useCallback(async (object, token) => {
		console.log("direct exists");
		setConversationID(object);

		setMessages([]);
		try {
			const result = await axios.get(`${BASE_URL}/chat/${object}/Messages`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessages(result.data);
		} catch (err) {
			console.log(err);
		}
	}, [setConversationID, setMessages]);

	const handleDirectMessage = useCallback(async (object, token) => {
		console.log("In handdle direct message");
		setConversationID(object.id);
		try {
			const result = await axios.get(`${BASE_URL}/chat/direct`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setConversations(result.data);
			setMessages([]);
		} catch (err) {
			setConversations([]);
			console.log(err);
		}
	}, [setConversations, setMessages, setConversationID]);

	useEffect(() => {
		const getTokenAndHandleSocketEvents = async () => {
			socket?.on('directExists', (object) => handleDirectExists(object, token));
			socket?.on('directMessage', (object) => handleDirectMessage(object, token));
		};

		getTokenAndHandleSocketEvents();

		return () => {
			socket?.off('directExists', handleDirectExists);
			socket?.off('directMessage', handleDirectMessage);
		};
	}, [handleDirectExists, handleDirectMessage, socket]);

	async function handleSelectedConversation(conversation: any) {
		console.log("i am in direct handleSelectedConversation");
		setConversationID(conversation.id);
		setMessages([]);
		try {
			const result = await axios.get(`${BASE_URL}/chat/${conversation.id}/Messages`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessages(result.data);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<Input.Search
				placeholder="Search friends"
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<List
				itemLayout="horizontal"
				dataSource={filterResults(conversations, searchText)}
				renderItem={conversation => (
					<List.Item
						onClick={() => handleSelectedConversation(conversation)}
						style={{
							border: (conversationID !== conversation.id) ? Colors.PRIMARY : Colors.SECONDARY + ' 1px solid',
							transition: 'border 0.2s ease-in-out',
							cursor: 'pointer',
							paddingLeft: '.5rem',
							borderRadius: '.5rem',
							color: 'white',
							marginTop: '.65rem',
							padding: '.75rem'
						}}
					>
						<List.Item.Meta
							avatar={<Picture
								src={`${BASE_URL}/users/profile-image/${userInfo?.profile_picture}/${token}`}
								onError={(e) => {
									e.currentTarget.src = UserProfilePicture;
								}}
								alt="A profile photo of the current user"
							/>}
							title={<span style={{ color: 'white' }}>{conversation.participants[0].user.username}</span>}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default DirectChat;