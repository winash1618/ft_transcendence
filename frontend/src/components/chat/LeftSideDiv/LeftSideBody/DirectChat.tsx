import { useCallback, useEffect, useState } from "react";
import { Colors, Conversation } from "../../chat.functions";
import axios from "axios";
import { List, Input } from 'antd';
import { Picture } from "../../chat.styled";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { BASE_URL } from "../../../../api";

interface DirectChatProp {
	conversations: Conversation[];
	UserProfilePicture: any;
	setConversationID: any;
	conversationID: any;
	setMessages: any;
}

const DirectChat = ({
	conversations,
	UserProfilePicture,
	setConversationID,
	conversationID,
	setMessages
}: DirectChatProp) => {
	const [searchText, setSearchText] = useState("");
	const { userInfo, token } = useAppSelector((state) => state.auth);

	const resetState = useCallback(() => {
		console.log("handleConversationLeft in DirectChat");
		setMessages([]);
		setConversationID(null);
	}, [setMessages, setConversationID]);

	useEffect(() => {
		console.log("i am in direct useEffect");
		resetState();
	}, [conversations, resetState]);

	const filterResults = (data: Conversation[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
	};

	async function handleSelectedConversation(conversation: any) {
		console.log("i am in direct handleSelectedConversation");
		setConversationID(conversation.id);
		setMessages([]);
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
						setMessages(response.data);
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
					<List.Item
						onClick={() => handleSelectedConversation(conversation)}
						style={{
							border: (conversationID !== conversation.id)
								? Colors.PRIMARY
								: Colors.SECONDARY + ' 1px solid',
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
								src={`${BASE_URL}/users/profile-image/${conversation.participants[0].user.profile_picture}/${token}`}
								onError={(e) => {
									e.currentTarget.src = UserProfilePicture;
								}}
								alt="A profile photo of the current user"
							/>}
							title={
								<span style={{ color: 'white' }}>
									{conversation.participants[0].user.username}
								</span>
							}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default DirectChat;