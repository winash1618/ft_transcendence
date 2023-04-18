import React, { useEffect, useState } from "react";
import { Nav, Privacy, Colors, Conversation } from "../../chat.functions";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";
import { List, Avatar, AutoComplete } from 'antd';

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

	const dispatch = useAppDispatch();
	const [filterValue, setFilterValue] = useState('');
	const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

	useEffect(() => {
		console.log("i am in direct useEffect", conversations);
		setFilteredConversations(conversations);
		setMessages([]);
		setConversationID(null);
	}, [conversations]);

	const getToken = async () => {
		try {
			const response = await axios.get("http://localhost:3001/token", {
				withCredentials: true,
			});
			localStorage.setItem("auth", JSON.stringify(response.data));
			return response.data.token;
		} catch (err) {
			dispatch(logOut());
			window.location.reload();
			return null;
		}
	};

	useEffect(() => {
		const handleDirectExists = async (object) => {
			console.log("direct exists", object);
			setConversationID(object);

			setMessages([]);
			const token = await getToken();
			try {
				const result = await axios.get(`http://localhost:3001/chat/${object}/Messages`, {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setMessages(result.data);
			} catch (err) {
				console.log(err);
			}
		};

		const handleDirectMessage = async (object) => {
			console.log("In handdle direct message");
			setConversationID(object.id);
			const token = await getToken();
			try {
				const result = await axios.get("http://localhost:3001/chat/direct", {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setConversations(result.data);
				setFilteredConversations(result.data);
				setMessages([]);
			} catch (err) {
				setConversations([]);
				console.log(err);
			}
		};

		socket?.on('directExists', handleDirectExists);
		socket?.on('directMessage', handleDirectMessage);
		return () => {
			socket?.off('directExists', handleDirectExists);
			socket?.off('directMessage', handleDirectMessage);
		};
	}, [socket, setConversations, setMessages, setConversationID]);

	async function handleSelectedConversation(conversation: any) {
		console.log("i am in direct handleSelectedConversation");
		setConversationID(conversation.id);
		setMessages([]);
		const token = await getToken();
		try {
			const result = await axios.get(`http://localhost:3001/chat/${conversation.id}/Messages`, {
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

	const handleAutoCompleteSearch = (value: string) => {
		setFilterValue(value);
		setFilteredConversations(conversations.filter(conversation => conversation.participants[0].user.username.toUpperCase().includes(value.toUpperCase())));
	};

	const options = filteredConversations.map(conversation => ({
		value: conversation.participants[0].user.username,
		label: conversation.participants[0].user.username,
	}));

	return (
		<>
			<div style={{ textAlign: 'center' }}>
				<AutoComplete
					options={options}
					value={filterValue}
					onSearch={handleAutoCompleteSearch}
					placeholder="Search conversations"
					filterOption={(inputValue, option) =>
						option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
					}
					style={{ width: '80%', marginBottom: '10px' }}
				/>
			</div>
			<List
				itemLayout="horizontal"
				dataSource={filteredConversations}
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
							marginBottom: '.65rem',
							padding: '.75rem'
						}}
					>
						<List.Item.Meta
							avatar={<Avatar src={UserProfilePicture} />}
							title={<span style={{ color: 'white' }}>{conversation.participants[0].user.username}</span>}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default DirectChat;