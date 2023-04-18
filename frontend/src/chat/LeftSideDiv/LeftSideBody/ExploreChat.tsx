import React, { useEffect, useState } from "react";
import { Colors, Nav, Privacy } from "../../chat.functions";
import { AutoComplete, Button, Input, List } from "antd";
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons';


interface ExploreChatProps {
	socket: any;
	conversations: Conversation[];
	setNavbar: any;
	Navbar: Nav;
}

interface Conversation {
	id: string;
	title: string;
	privacy: "PUBLIC" | "PROTECTED" | "PRIVATE";
}

const ExploreChat = ({
	socket,
	conversations,
	setNavbar,
	Navbar,
}: ExploreChatProps) => {
	const [selectedConversationID, setSelectedConversationID] = React.useState("");
	const [password, setPassword] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
	const [menuVisible, setMenuVisible] = useState(false);

	function handleSelectedConversation(conversation: any) {
		console.log("handleSelectedConversation in ExploreChat")
		setSelectedConversationID(conversation.id);
		if (conversation.privacy === "PUBLIC") {
			socket?.emit("joinConversation", { conversationID: conversation.id, password: "" });
			setNavbar(Nav.GROUPS);
		}
		else if (conversation.privacy === "PROTECTED") {
			setMenuVisible(menuVisible === false ? true : false);
		}
	}

	function handleProtectedConversation(conversation: any, password: string) {
		console.log("handleProtectedConversation in ExploreChat")
		socket?.emit("joinConversation", { conversationID: conversation.id, password: password });
		setPassword('');
		setMenuVisible(false);
		setNavbar(Nav.GROUPS);
	}

	const handleSearch = value => {
		setSearchKeyword(value);
		setFilteredConversations(conversations.filter(conversation => conversation.title.toLowerCase().includes(value.toLowerCase())));
	};

	useEffect(() => {
		console.log("Explore useEffect to reset data");
		setFilteredConversations(conversations);
		setMenuVisible(false);
	}, [conversations, Navbar]);

	return (
		<>
			<div style={{ textAlign: 'center' }}>
				<AutoComplete
					options={[]}
					value={searchKeyword}
					placeholder="Search conversations"
					onSearch={handleSearch}
					style={{ width: '80%', marginBottom: '10px' }}
				/>
			</div>
			<List
				itemLayout="horizontal"
				dataSource={filteredConversations}
				renderItem={(conversation) => (
					<>
						<List.Item
							onClick={() => handleSelectedConversation(conversation)}
							style={{
								border: (selectedConversationID !== conversation.id) ? Colors.PRIMARY : Colors.SECONDARY + ' 1px solid',
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
								title={
									<span style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<div style={{ width: '10rem' }}>
											{conversation.title}
										</div>
										<div style={{ width: '5rem', display: 'flex', justifyContent: 'right' }}>
											{
												conversation !== undefined && conversation.privacy === 'PUBLIC'
													? <EyeOutlined /> : conversation.privacy === 'PROTECTED'
														? <LockOutlined /> : conversation.privacy === 'PRIVATE'
															? <EyeInvisibleOutlined /> : null
											}
											
										</div>
									</span>
								}
							/>
						</List.Item>
						{selectedConversationID === conversation.id &&
							conversation.privacy === Privacy.PROTECTED &&
							menuVisible && (
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
											handleProtectedConversation(conversation, password)
										}
									>
										Join
									</Button>
								</div>
							)}
					</>
				)}
			/>
		</>
	);
};

export default ExploreChat;