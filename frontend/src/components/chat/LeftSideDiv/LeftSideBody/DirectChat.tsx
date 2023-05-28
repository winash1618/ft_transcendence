import { useCallback, useEffect, useState } from "react";
import { Colors, Conversation } from "../../chat.functions";
import { List, Input, Pagination } from 'antd';
import { Picture } from "../../chat.styled";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { BASE_URL, axiosPrivate } from "../../../../api";

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
	const { token } = useAppSelector((state) => state.auth);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const resetState = useCallback(() => {
		setMessages([]);
		setConversationID(null);
	}, [setMessages, setConversationID]);

	useEffect(() => {
		resetState();
	}, [conversations, resetState]);

	const filterResults = (data: Conversation[], searchText: string) => {
		if (!searchText) {
			return data;
		}
		return data.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase()));
	};

	async function handleSelectedConversation(conversation: any) {
		setConversationID(conversation.id);
		setMessages([]);
		try {
			await axiosPrivate.get(`/chat/${conversation.id}/Messages`)
				.then(response => {
					if (response.status === 200) {
						setMessages(response.data);
					} else {
						// window.location.reload();
						window.location.href = '/error';
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

	return (
		<>
			<Input.Search
				placeholder="Search friends"
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<List
				itemLayout="horizontal"
				dataSource={filterResults(conversations, searchText).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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

export default DirectChat;
