import React from 'react';
import { ChatListContainer, MessageBox, MessageNav, MessageNavNotUsed, ParentContainer, ParentMessageNav } from './messages.styled';

const MessagesPage = () => {
	return (
		<>
			<ParentContainer>
				<ChatListContainer>
					<ParentMessageNav>
						<MessageNav>Normal Button</MessageNav>
						<MessageNavNotUsed>Tomato Button</MessageNavNotUsed>
					</ParentMessageNav>
				</ChatListContadociner>
				<MessageBox>
					<h1>Message Box</h1>
				</MessageBox>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
