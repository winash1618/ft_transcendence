import React from 'react';
import { ChatListContainer, ContactDiv, ContactImage, ContactName, MessageBox, MessageImage, MessageInput, MessageInputParent, MessageLeft, MessageLeftContainer, MessageNav, MessageNavNotUsed, MessageParent, MessageRight, MessageRightContainer, MessageSendDiv, ParentContainer, ParentMessageNav } from './messages.styled';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { BsSend } from 'react-icons/bs';
import { UserProfilePicture } from '../../assets';
const MessagesPage = () => {
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
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>

							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageRightContainer>
								<MessageRight>
									Hello, I am no one dsfa;lfdalkfasldkfjdskflj ksdlfjdkslfjaskldfjaksldfj
								</MessageRight>
								<MessageImage src={UserProfilePicture} alt="" />
							</MessageRightContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>
							<MessageLeftContainer>
								<MessageImage src={UserProfilePicture} alt="" />
								<MessageLeft>
									jkhdafskjhdjfhadsjkfhadskjfh asjdhfj
								</MessageLeft>
							</MessageLeftContainer>
						</MessageParent>
					</MessageSendDiv>
					<MessageInputParent>
						<MessageInput placeholder="A bigger text input" />
						< BsSend size={24} />
					</MessageInputParent>
				</MessageBox>
			</ParentContainer>
		</>
	)
};

export default MessagesPage;
