import React, { useEffect, useState } from "react";
import { Heading2 } from "./styles/CreateChannelFormDiv.styled";
import { ContactDiv, ContactImage, ContactName, DropdownField, StyledTiLockClosed, StyledTiLockOpen } from "./styles/LeftsideDiv.styled";

enum Nav {
	INBOX,
	CHANNELS,
	EXPLORE,
	CREATE,
}

const Privacy = {
	PUBLIC: 'PUBLIC',
	PRIVATE: 'PRIVATE',
	PROTECTED: 'PROTECTED',
	DIRECT: 'DIRECT'
};

interface ChannelsAvailableDivProps {
	  publicConversations: any;
	  UserProfilePicture: any;
	  joinPublicConversation: any;
	  joinProtectedConversation: any;
	  navBar: any;
}


function ChannelsAvailableDiv({
	publicConversations,
	UserProfilePicture,
	joinPublicConversation,
	joinProtectedConversation,
	navBar,
}: ChannelsAvailableDivProps) {

	const [isProtected, setIsProtected] = useState(false);
	const [selectedConversationId, setSelectedConversationId] = useState(null);
	const [password, setPassword] = useState('');
	useEffect(() => {
		setIsProtected(false);
		// setPassword(''); not sure if this is needed
	}, [navBar]);
	// }, [navBar]);
	function handlePublicConversationsClick(conversation: any) {
		if (conversation.privacy === Privacy.PUBLIC)
		joinPublicConversation(conversation);
		else if (conversation.privacy === Privacy.PROTECTED) {
			setSelectedConversationId(conversation.id);
			setIsProtected((isProtected === false) ? true : false);
		}
	}

	function handleJoinProtectedConversation(conversation: any, password: string) {
		joinProtectedConversation(conversation, password);
		setIsProtected((isProtected === false) ? true : false);
	}

	const handlePasswordChange = (event) => {
		const value = event.target.value;
		setPassword(value);
	};
  return (
	<>
				<Heading2> Channels Available </Heading2>
				{
					publicConversations.map((c) => {
						if (c) {
							return (
								<React.Fragment key={c.id}>
									<ContactDiv key={c.id} backgroundColor={"#1A1D1F"} onClick={() => handlePublicConversationsClick(c)}>
										<ContactImage src={UserProfilePicture} alt="" />
										{
											(c.privacy === Privacy.PUBLIC) ?
												<><ContactName>{c.title} <StyledTiLockOpen /> </ContactName></> :
												<><ContactName>{c.title} <StyledTiLockClosed /> </ContactName> </>
										}
									</ContactDiv>
									{
										(selectedConversationId === c.id && isProtected) ?
											<DropdownField>
												<input
													type="password"
													placeholder="Password"
													value={password}
													onChange={handlePasswordChange}
													required
												/>
												<button onClick={() => handleJoinProtectedConversation(c, password)}>Join</button>
											</DropdownField>
											: null
									}
								</React.Fragment>
							);
						}
					})
				}
			</>
  );
}