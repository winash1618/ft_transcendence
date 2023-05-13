import { useCallback, useEffect, useState } from "react";
import { Colors, Conversation, GNav, Privacy, Role, Status } from "../../chat.functions";
import axios from "axios";
import { List, Dropdown, MenuProps, Input, message } from 'antd';
import { GroupArrow } from "../../RightSideDiv/GroupChatRelations/group.styled";
import { DownOutlined } from "@ant-design/icons";
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, StopOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { BASE_URL } from "../../../../api";
import { IoMdAddCircleOutline } from "react-icons/io";
import PageNotFound404 from "../../../../pages/errorPages/pageNotFound";

interface GroupChatProps {
	socket: any;
	conversations: Conversation[];
	setConversationID: any;
	conversationID: any;
	setMessages: any;
	setConversation: any;
	setStatus: any;
	conversation: any;
	setGroupResults: any;
}

const GroupChat = ({
	socket,
	conversations,
	setConversationID,
	conversationID,
	setMessages,
	setConversation,
	setStatus,
	conversation,
	setGroupResults,
}: GroupChatProps) => {
	const [password, setPassword] = useState('');
	const [menuVisible, setMenuVisible] = useState(false);
	const [searchText, setSearchText] = useState("");
	const { token } = useAppSelector((state) => state.auth);

	const filterResults = (data: Conversation[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
	};

	const resetGroupResults = useCallback(() => {
		console.log("resetGroupResults in GroupChat");
		console.log("conversations in resetGroupResults", conversations, conversation, conversationID);
		setGroupResults([]);
	}, [setGroupResults]);

	useEffect(() => {
		setMenuVisible(false);
		resetGroupResults()
	}, [conversation, resetGroupResults, setMenuVisible]);

	function handleUpdatePassword(conversation: any, password: string) {
		console.log("handleProtectedConversation in GroupChat");
		socket?.emit("addPassword", { conversationID: conversation.id, password: password });
		setPassword('');
		setMenuVisible(false);
	}

	const items: MenuProps["items"] = [
		{
			key: "1",
			label: <div onClick={(e) => handleMenuClick(e)}>Leave conversation</div>,
		},
		{
			key: "2",
			label: <div onClick={(e) => handleMenuClick(e)}>Add password</div>,
			disabled: !(conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy === Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)),
		},
		{
			key: "3",
			label: <div onClick={(e) => handleMenuClick(e)}>Update password</div>,
			disabled: !(conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy !== Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)),
		},
		{
			key: "4",
			label: <div onClick={(e) => handleMenuClick(e)}>Remove password</div>,
			disabled: !(conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy !== Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)),
		},
	];

	async function handleSelectedConversation(conversation: any) {
		console.log("handleSelectedConversation in GroupChat")
		const current_status = conversation.participants[0].conversation_status;
		setStatus(conversation.participants[0].conversation_status);
		if (current_status === Status.ACTIVE || current_status === Status.MUTED) {
			setConversationID(conversation.id);
			setConversation(conversation);
			try {
				await axios.get(`${BASE_URL}/chat/${conversation.id}/Messages`, {
					withCredentials: true,
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}).then(response => {
					if (response.status === 200) {
						console.log('response', response);
						console.log('Request succeeded!');
						setMessages(response.data)
					} else {
						window.location.href = '/error';
					}
				})
					.catch(error => {
						console.error('An error occurred:', error);
					});
			} catch (err) {
				console.log(err);
			}
			try {
				await axios.get(
					`${BASE_URL}/chat/${conversation.id}/members`,
					{
						withCredentials: true,
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				).then(response => {
					if (response.status === 200) {
						console.log('response', response);
						console.log('Request succeeded!');
						setGroupResults(response.data);
					} else {
						window.location.href = '/error';
					}
				})
					.catch(error => {
						console.error('An error occurred:', error);
					});
			} catch (err) {
				console.log(err);
			}
		}
		
	}

	const handleMenuClick = (e: any) => {
		console.log("handleMenuClick in GroupChat ", e.target.outerText);
		if (e.target.outerText === "Leave conversation") {
			console.log("Leave conversation");
			socket?.emit("leaveConversation", { conversationID: conversationID });
		} else if (e.target.outerText === "Add password") {
			setMenuVisible(menuVisible === false ? true : false);
			console.log("Add password");
		} else if (e.target.outerText === "Update password") {
			setMenuVisible(menuVisible === false ? true : false);
			console.log("Update password");
		} else if (e.target.outerText === "Remove password") {
			console.log("Remove password");
			socket?.emit("removePassword", { conversationID: conversationID });
		}
	};

	return (
		<>
			<Input.Search
				placeholder="Search friends"
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<List
				itemLayout="horizontal"
				locale={{ emptyText: "No conversations found" }}
				dataSource={filterResults(conversations, searchText)}
				renderItem={conversation => (
					<>
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
								title={
									<span style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<div style={{ width: '10rem' }}>
											{conversation.title}

										</div>
										<div style={{ width: '5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											{
												conversation !== undefined && conversation.privacy === 'PUBLIC'
													? <EyeOutlined /> : conversation.privacy === 'PROTECTED'
														? <LockOutlined /> : conversation.privacy === 'PRIVATE'
															? <EyeInvisibleOutlined /> : null
											}
											{
												conversation && conversation.participants !== undefined && (conversation.participants[0].conversation_status === Status.ACTIVE
													? <CheckCircleOutlined style={{ color: 'green' }} /> : conversation.participants[0].conversation_status === Status.BANNED
														? <StopOutlined style={{ color: 'red' }} /> : conversation.participants[0].conversation_status === Status.MUTED
															? <ExclamationCircleOutlined style={{ color: 'yellow' }} /> : conversation.participants[0].conversation_status === Status.KICKED
																? <ExclamationCircleOutlined style={{ color: 'red' }} /> : null)
											}
											{
												<Dropdown menu={{ items }} trigger={["click"]}>
													<GroupArrow>
														<DownOutlined className="group-arrow" color="white" />
													</GroupArrow>
												</Dropdown>
											}
										</div>
									</span>
								}
							/>
						</List.Item>
						{conversationID === conversation.id && menuVisible && (
							<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', marginTop: "0.5rem", paddingRight: "0.5rem", paddingLeft: "0.5rem" }}>
								<Input
									placeholder="Enter password"
									style={{ width: "85%" }}
									value={password}
									type="password"
									onChange={(e) => setPassword(e.target.value)}
								/>
								<IoMdAddCircleOutline size={24} color="green" onClick={() => handleUpdatePassword(conversation, password)} />
							</div>

						)}
					</>
				)}
			/>
		</>
	);
};

export default GroupChat;