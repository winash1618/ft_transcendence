import React, { useState } from "react";
import { Colors } from "../../chat.functions";
import { AutoComplete, List } from "antd";

interface ExploreChatProps {
	conversations: Conversation[];
}

interface Conversation {
	id: string;
	title: string;
	privacy: "PUBLIC" | "PROTECTED" | "PRIVATE";
}

const ExploreChat = ({
	conversations,
}: ExploreChatProps) => {
	const [selectedConversationID, setSelectedConversationID] = React.useState("");

	function handleSelectedConversation(conversation: any) {
		setSelectedConversationID(conversation.id);
	}
	const [searchKeyword, setSearchKeyword] = useState('');

	const handleSearch = value => {
		setSearchKeyword(value);
	};

	const filteredConversations = conversations.filter(conversation =>
		conversation.title.toLowerCase().includes(searchKeyword.toLowerCase())
	);

	return (
		<>
			<div style={{ textAlign: 'center' }}>
				<AutoComplete
					options={[]}
					placeholder="Search conversations"
					onSearch={handleSearch}
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
							backgroundColor: selectedConversationID === conversation.id ? Colors.SECONDARY : Colors.PRIMARY,
							transition: 'background-color 0.3s ease-in-out',
							cursor: 'pointer',
							paddingLeft: '20px',
							borderRadius: '10px',
							color: 'white',
							marginBottom: '10px',
						}}
					>
						<List.Item.Meta
							title={<span style={{ color: 'white' }}>{conversation.title} {conversation.privacy === 'PUBLIC' ? '(PUBLIC)' : conversation.privacy === 'PROTECTED' ? '(PROTECTED)' : conversation.privacy === 'PRIVATE' ? '(PRIVATE)' : null}</span>}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default ExploreChat;