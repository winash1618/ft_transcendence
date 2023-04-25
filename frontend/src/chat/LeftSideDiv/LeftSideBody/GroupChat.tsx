import { useEffect, useState } from "react";
import { Colors, Conversation, GNav, Nav, Privacy, Role, Status } from "../../chat.functions";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { logOut } from "../../../store/authReducer";
import { List, Avatar, Button, Dropdown, MenuProps, Input } from 'antd';
import { GroupArrow } from "../../RightSideDiv/GroupChatRelations/group.styled";
import { DownOutlined } from "@ant-design/icons";
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, StopOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Picture } from "../../chat.styled";


interface GroupChatProps {
	socket: any;
	conversations: Conversation[];
	UserProfilePicture: any;
	setConversationID: any;
	conversationID: any;
	setMessages: any;
	setConversation: any;
	setStatus: any;
	conversation: any;
	setGroupResults: any;
	setGroupNav: any;
}

const GroupChat = ({
	socket,
	conversations,
	UserProfilePicture,
	setConversationID,
	conversationID,
	setMessages,
	setConversation,
	setStatus,
	conversation,
	setGroupResults,
	setGroupNav,
}: GroupChatProps) => {
	const { user } = useAppSelector((state) => state.users);
	const dispatch = useAppDispatch();
	const [password, setPassword] = useState('');
	const [menuVisible, setMenuVisible] = useState(false);
	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		const handleConversationLeft = () => {
			console.log("handleConversationLeft in GroupChat");
			setMessages([]);
			setConversationID(null);
			setMessages([]);
		};
		socket?.on('conversationLeft', handleConversationLeft);
		return () => {
			socket?.off('conversationLeft', handleConversationLeft);
		};
	}, [socket]);


	const filterResults = (data: Conversation[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
	};

	useEffect(() => {
		setMenuVisible(false);
		setGroupResults([]);
	}, [conversation]);

	useEffect(() => {
		console.log("Group useEffect to reset data");
		setMessages([]);
		setConversationID(null);
		setGroupResults([]);
	}, [conversations]);

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
			disabled: !(conversation && conversation !== undefined && conversation.participants !== undefined && conversation.privacy === Privacy.PUBLIC && conversation.participants[0].role === Role.OWNER),
		},
		{
			key: "3",
			label: <div onClick={(e) => handleMenuClick(e)}>Update password</div>,
			disabled: !(conversation && conversation !== undefined && conversation.participants !== undefined && conversation.privacy !== Privacy.PUBLIC && conversation.participants[0].role === Role.OWNER),
		},
		{
			key: "4",
			label: <div onClick={(e) => handleMenuClick(e)}>Remove password</div>,
			disabled: !(conversation && conversation !== undefined && conversation.participants !== undefined && conversation.privacy !== Privacy.PUBLIC && conversation.participants[0].role === Role.OWNER),
		},
	];
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


	async function handleSelectedConversation(conversation: any) {
		console.log("handleSelectedConversation in GroupChat")
		const current_status = conversation.participants[0].conversation_status;
		setStatus(conversation.participants[0].conversation_status);
		if (current_status === Status.ACTIVE || current_status === Status.MUTED) {
			setConversationID(conversation.id);
			setConversation(conversation);
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
			try {
				const result = await axios.get(
				`http://localhost:3001/chat/${conversation.id}/members`,
				{
					withCredentials: true,
					headers: {
					Authorization: `Bearer ${token}`,
					},
				}
				);
				setGroupNav(GNav.GROUPS);
				setGroupResults(result.data);
				console.log("Group members", result.data);
			} catch (err) {
				console.log(err);
			}
		}
	}

	const handleMenuClick = (e: any) => {
		console.log("handleMenuClick in GroupChat", e.target.outerText);
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
								avatar={<Picture
									src={`http://localhost:3001/users/profile-image/${user?.profile_picture}`}
									onError={(e) => {
									  e.currentTarget.src = UserProfilePicture;
									}}
									alt="A profile photo of the current user"
								  />}
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
							<div style={{ marginTop: "10px", paddingLeft: "20px" }}>
								<Input
									placeholder="Enter password"
									style={{ width: "50%" }}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Button
									type="primary"
									style={{ marginLeft: "10px" }}
									onClick={() =>
										handleUpdatePassword(conversation, password)
									}
								>
									{conversation.privacy === "PUBLIC" ? "Add password" : "Update password"}
								</Button>
							</div>
						)}
					</>
				)}
			/>
		</>
	);
};

export default GroupChat;