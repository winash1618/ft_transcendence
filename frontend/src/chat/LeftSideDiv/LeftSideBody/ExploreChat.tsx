import React, { useEffect, useState } from "react";
import { Colors, Nav, Privacy } from "../../chat.functions";
import { AutoComplete, Button, Input, List } from "antd";

interface ExploreChatProps {
	socket: any;
	conversations: Conversation[];
	setNavbar: any;
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
}: ExploreChatProps) => {
	const [selectedConversationID, setSelectedConversationID] = React.useState("");
	const [password, setPassword] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);


	function handleSelectedConversation(conversation: any) {
		console.log("handleSelectedConversation in ExploreChat")
		setSelectedConversationID(conversation.id);
		if (conversation.privacy === "PUBLIC") {
			socket?.emit("joinConversation", { conversationID: conversation.id, password: "" });
			setNavbar(Nav.GROUPS);
		}
	}

	function handleProtectedConversation(conversation: any, password: string) {
		console.log("handleProtectedConversation in ExploreChat")
		socket?.emit("joinConversation", { conversationID: conversation.id, password: password });
		setNavbar(Nav.GROUPS);
	}
	const handleSearch = value => {
		setSearchKeyword(value);
		setFilteredConversations(conversations.filter(conversation => conversation.title.toLowerCase().includes(value.toLowerCase())));
	};

	useEffect(() => {
		console.log("Explore useEffect to reset data");
		setFilteredConversations(conversations);
	}, [conversations]);

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
								backgroundColor:
									selectedConversationID === conversation.id
										? Colors.SECONDARY
										: Colors.PRIMARY,
								transition: "background-color 0.3s ease-in-out",
								cursor: "pointer",
								paddingLeft: "20px",
								borderRadius: "10px",
								color: "white",
								marginBottom: "10px",
							}}
						>
							<List.Item.Meta
								title={
									<span style={{ color: "white" }}>
										{conversation.title}{" "}
										{conversation.privacy === "PUBLIC"
											? "(PUBLIC)"
											: conversation.privacy === "PROTECTED"
												? "(PROTECTED)"
												: conversation.privacy === "PRIVATE"
													? "(PRIVATE)"
													: null}
									</span>
								}
							/>
						</List.Item>
						{selectedConversationID === conversation.id &&
							conversation.privacy === Privacy.PROTECTED && (
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