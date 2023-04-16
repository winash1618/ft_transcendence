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
	setMessages: any;
	Navbar: Nav;
}



const DirectChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	conversationID,
	setMessages,
	Navbar,
}: DirectChatProp) => {

	const dispatch = useAppDispatch();
	const [filterValue, setFilterValue] = useState('');

	useEffect(() => {
		console.log("conversations", conversations);
		setMessages([]);
		// setConversationID('');
	}, [conversations, Navbar]);

	async function handleSelectedConversation(conversation: any) {
		setConversationID(conversation.id);
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

	const filteredConversations = conversations.filter(
		conversation => conversation.participants[0].user.username.toUpperCase().includes(filterValue.toUpperCase())
	);

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
					onSearch={setFilterValue}
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
							backgroundColor: (conversationID === conversation.id) ? Colors.SECONDARY : Colors.PRIMARY,
							transition: 'background-color 0.3s ease-in-out',
							cursor: 'pointer',
							paddingLeft: '20px',
							borderRadius: '10px',
							color: 'white',
							marginBottom: '10px'
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