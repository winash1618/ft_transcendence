// import React, { useState } from 'react';
import { ChatListContainer, SendButton, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav } from './messages.styled';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
// import { BsSend } from 'react-icons/bs';
import { UserProfilePicture } from '../../assets';

// import { useState } from "react";

// function MyComponent() {
//   const [message, setMessage] = useState("");

//   function handleMessageInput(event: React.ChangeEvent<HTMLInputElement>) {
//     setMessage(event.target.value);
//   }0

const MessagesPage = () => {
	// const messages = useState<string[]>([]);
	// const message = useState<string>('');
	
	return (
		<>
			<ParentContainer>
				<ChatListContainer>
					<ParentMessageNav>
						<MessageNav>
							<HiOutlineUser /> Inbox
						</MessageNav>
						<MessageNavNotUsed>
							<HiOutlineUserGroup /> Groups
						</MessageNavNotUsed>
					</ParentMessageNav>

					<ContactDiv>
						<ContactImage src={UserProfilePicture} />
						<ContactName>
							John Doe
						</ContactName>
					</ContactDiv>
					<ContactDiv>
						<ContactImage src={UserProfilePicture} />
						<ContactName>
							John Doe
						</ContactName>
					</ContactDiv>
					<ContactDiv>
						<ContactImage src={UserProfilePicture} />
						<ContactName>
							John Doe
						</ContactName>
					</ContactDiv>
					<ContactDiv>
						<ContactImage src={UserProfilePicture} />
						<ContactName>
							John Doe
						</ContactName>
					</ContactDiv>
				</ChatListContainer>
				<MessageBox>
					<MessageSendDiv>
						<MessageParent>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									Hello, This is not oggu
								</MessageLeft>
							</MessageLeftContainer>
						</MessageParent>
					</MessageSendDiv>
					<MessageInputParent>
						<MessageInput placeholder="A bigger text input" onChange={() => {}}/>
						<SendButton size={24} />
					</MessageInputParent>
				</MessageBox>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
