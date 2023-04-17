import React, { useEffect, useState } from "react";
import { Colors, Conversation, Nav, Role, Status } from "../../chat.functions";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";
import { List, Avatar, AutoComplete, Dropdown, Button, Menu } from 'antd';

interface GroupChatProps {
	conversations: Conversation[];
	UserProfilePicture: any;
	setConversationID: any;
	conversationID: any;
	setMessages: any;
	setConversation: any;
	setStatus: any;
}


const GroupChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	conversationID,
	setMessages,
	setConversation,
	setStatus
}: GroupChatProps) => {

	const dispatch = useAppDispatch();
	const [filterValue, setFilterValue] = useState('');
	const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

	useEffect(() => {
		console.log("Group useEffect to reset data");
		setFilteredConversations(conversations);
		setMessages([]);
		setConversationID(null);
	}, [conversations]);

	async function handleSelectedConversation(conversation: any) {
		console.log("handleSelectedConversation in GroupChat")
		const current_status = conversation.participants[0].conversation_status;
		setStatus(conversation.participants[0].conversation_status);
		if (current_status === Status.ACTIVE || current_status === Status.MUTED) {
			setConversationID(conversation.id);
			setConversation(conversation);
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
				console.log("Messages Object from Group chat");
				setMessages(result.data);
			} catch (err) {
				console.log(err);
			}
		}
	}

	const handleAutoCompleteSearch = (value: string) => {
		console.log("handleAutoCompleteSearch in GroupChat");
		setFilterValue(value);
		setFilteredConversations(conversations.filter(conversation => conversation.title.toLowerCase().includes(value.toLowerCase())));
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
					<>
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
								title={
									<span style={{ color: 'white' }}>
										{conversation.title}
										{
											conversation.privacy === 'PUBLIC'
												? ' (PUBLIC)' : conversation.privacy === 'PROTECTED'
													? ' (PROTECTED)' : conversation.privacy === 'PRIVATE'
														? ' (PRIVATE)' : null
										}
										{
											conversation.participants[0].conversation_status === Status.ACTIVE
												? ' (ACTIVE)' : conversation.participants[0].conversation_status === Status.BANNED
													? ' (BANNED)' : conversation.participants[0].conversation_status === Status.MUTED
														? ' (MUTED)' : conversation.participants[0].conversation_status === Status.KICKED
															? ' (KICKED)' : null
										}
									</span>
								}
							/>
						</List.Item>
						{
							conversationID === conversation.id && (<div>
								<Button
										type="primary"
										style={{ marginLeft: "10px", backgroundColor: "red", borderColor: "red" }}
									>
										Leave conversation
									</Button>
								{conversation.participants[0].role === Role.OWNER && (<Button
										type="primary"
										style={{ marginLeft: "10px", backgroundColor: "blue", borderColor: "blue" }}
									>
										Add password
									</Button>)}
									</div>)
						}
					</>
				)}
			/>
		</>
	);
};

export default GroupChat;