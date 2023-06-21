import { useCallback, useEffect, useState } from "react";
import { Colors, Conversation, Privacy, Role, Status } from "../../chat.functions";
import { List, Dropdown, MenuProps, Input, Pagination } from 'antd';
import { GroupArrow } from "../../RightSideDiv/GroupChatRelations/group.styled";
import { DownOutlined } from "@ant-design/icons";
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, StopOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { axiosPrivate } from "../../../../api";
import { IoMdAddCircleOutline } from "react-icons/io";

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
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const filterResults = (data: Conversation[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
	};

	const resetGroupResults = useCallback(() => {
		setGroupResults([]);
	}, [setGroupResults]);

	useEffect(() => {
		setMenuVisible(false);
		resetGroupResults()
	}, [conversation, resetGroupResults, setMenuVisible]);

	function handleUpdatePassword(conversation: any, password: string) {
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
			label: (conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy === Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)) ? <div onClick={(e) => handleMenuClick(e)}>Add password</div> : 
				<div>Add password</div>,
			disabled: !(conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy === Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)),
		},
		{
			key: "3",
			label: (conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy !== Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)) ? <div onClick={(e) => handleMenuClick(e)}>Update password</div> : 
				<div>Update password</div>,
			disabled: !(conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy !== Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)),
		},
		{
			key: "4",
			label: (conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy !== Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)) ? <div onClick={(e) => handleMenuClick(e)}>Remove password</div> : <div>Remove password</div>,
			disabled: !(conversation
				&& conversation !== undefined
				&& conversation.participants !== undefined
				&& conversation.privacy !== Privacy.PUBLIC
				&& (conversation.participants[0].role === Role.OWNER || conversation.participants[0].role === Role.ADMIN)),
		},
	];

	async function handleSelectedConversation(conversation: any) {
		const current_status = conversation.participants[0].conversation_status;
		setStatus(conversation.participants[0].conversation_status);
		if (current_status === Status.ACTIVE || current_status === Status.MUTED) {
			setConversationID(conversation.id);
			setConversation(conversation);
			try {
				await axiosPrivate.get(`/chat/${conversation.id}/Messages`)
					.then(response => {
						if (response.status === 200) {
							setMessages(response.data)
						} else {
							window.location.href = '/error';
							// window.location.reload();
						}
					})
					.catch(error => {
						window.location.href = '/error';
						// window.location.reload();
					});
			} catch (err) {
				console.log(err);
			}
			try {
				await axiosPrivate.get(`/chat/${conversation.id}/members`)
					.then(response => {
						if (response.status === 200) {
							setGroupResults(response.data);
						} else {
							window.location.href = '/error';
							// window.location.reload();
						}
					})
					.catch(error => {
						window.location.href = '/error';
						// window.location.reload();
					});
			} catch (err) {
				console.log(err);
			}
		}
	}

	const handleMenuClick = (e: any) => {
		if (e.target.outerText === "Leave conversation") {
			socket?.emit("leaveConversation", { conversationID: conversationID });
		} else if (e.target.outerText === "Add password") {
			setMenuVisible(menuVisible === false ? true : false);
		} else if (e.target.outerText === "Update password") {
			setMenuVisible(menuVisible === false ? true : false);
		} else if (e.target.outerText === "Remove password") {
			socket?.emit("removePassword", { conversationID: conversationID });
		}
	};

	return (
		<>
			<Input.Search
				placeholder="Search conversations"
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<List
				itemLayout="horizontal"
				locale={{ emptyText: "No conversations found" }}
				dataSource={filterResults(conversations, searchText).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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
													? <CheckCircleOutlined style={{ color: '#63a4ff' }} /> : conversation.participants[0].conversation_status === Status.BANNED
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
								<IoMdAddCircleOutline size={24} color="#63a4ff" onClick={() => handleUpdatePassword(conversation, password)} />
							</div>

						)}
					</>
				)}
			/>
			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={filterResults(conversations, searchText).length}
				onChange={(page, pageSize) => {
					setCurrentPage(page);
					setPageSize(pageSize);
				}}
				style={{display: "flex", justifyContent: "center", alignItems: "flex-end", marginTop: "1rem"}}
			/>
		</>
	);
};

export default GroupChat;
