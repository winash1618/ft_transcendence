import React, { useEffect, useState } from "react";
import { Colors, Nav, Privacy } from "../../chat.functions";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";
import { List, Avatar, AutoComplete } from 'antd';

interface GroupChatProps {
	conversations: Conversation[];
	UserProfilePicture: any;
	setConversationID: any;
	conversationID: any;
	setMessages: any;
	setSender: any;
}

interface Conversation {
	id: number;
	title: string;
	privacy: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
}


const GroupChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	conversationID,
	setMessages,
	setSender,
}: GroupChatProps) => {

	const dispatch = useAppDispatch();
	const [filterValue, setFilterValue] = useState('');
	const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

	useEffect(() => {
		setFilteredConversations(conversations);
	}, [conversations]);

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
		const token = await getToken();
		try {
			const result = await axios.get(`http://localhost:3001/chat/${conversation.id}/Messages`, {
				withCredentials: true,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setMessages(result.data.conversations);
			setSender(result.data.sender);
		} catch (err) {
			console.log(err);
		}
	}

	const handleAutoCompleteSearch = (value: string) => {
		setFilterValue(value);
		setFilteredConversations(conversations.filter(conversation => conversation.title.toLowerCase().includes(value.toLowerCase())));
		console.log("filteredconversation", filteredConversations);
	};

	const options = filteredConversations.map(conversation => ({
		value: conversation.title,
		label: conversation.title,
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
				dataSource={filteredConversations.filter(conversation => conversation)}
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
							title={<span style={{ color: 'white' }}>{conversation.title} {conversation.privacy === 'PUBLIC' ? '(PUBLIC)' : conversation.privacy === 'PROTECTED' ? '(PROTECTED)' : conversation.privacy === 'PRIVATE' ? '(PRIVATE)' : null}</span>}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default GroupChat;