
import { BASE_URL } from "../../../../api";
import { useAppSelector } from "../../../../hooks/reduxHooks";
import { PictureLeft, PictureRight } from "../../chat.styled";
import { MessageParent, MessageSendDiv } from "../MessageDiv.styled";
import { Col, Row } from "antd";

interface MessageInboxProps {
	userObject: any;
	messages: any;
	messageEndRef: any;
	UserProfilePicture: any;
}
function splitLongWords(message) {
	const words = message.split(' ');
	const splitWords = words.map(word => {
		if (word.length > 10) {
			return word.match(/.{1,10}/g).join(' ');
		}
		return word;
	});
	return splitWords.join(' ');
}

function MessageInbox(
	{
		userObject,
		messages,
		messageEndRef,
		UserProfilePicture,
	}: MessageInboxProps) {
	const { userInfo, token } = useAppSelector((state) => state.auth);
	return (
		<>
			<MessageSendDiv>
				<MessageParent>
					{(
						messages.map((message) => {
							if (message.author.user.id === userObject.id) {
								return (
									<Row key={message.id} justify="end" style={{ marginBottom: '1em', marginTop: '1em' }}>
										<Col xs={24} sm={18} md={12} lg={8}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'flex-end',
													alignItems: 'center',
													background: '#111315',
													border: '1px solid #63a4ff',
													borderRadius: '15px 15px 0 15px',
													color: 'white',
													padding: '1em',
												}}
											>
												<div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginRight: '10px' }}>
													<div style={{ color: 'red' }}>
														{userObject.username}
													</div>
													<div style={{ width: '100%', maxWidth: '500px', marginRight: '10px' }}>
														{splitLongWords(message.message)}
													</div>
												</div>
												<PictureRight
													src={`${BASE_URL}/users/profile-image/${userInfo?.profile_picture}/${token}`}
													onError={(e) => {
														e.currentTarget.src = UserProfilePicture;
													}}
													alt="A profile photo of the current user"
												/>
											</div>
										</Col>
									</Row>
								);
							} else {
								return (
									<Row key={message.id} justify="start" style={{ marginBottom: '1em', marginTop: '1em' }}>
										<Col xs={24} sm={18} md={12} lg={8}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'flex-start',
													alignItems: 'center',
													background: '#e4e4e4',
													border: '1px solid #ddd',
													borderRadius: '15px 15px 15px 0',
													color: 'black',
													padding: '1em',
												}}
											>
												<PictureLeft
													src={`${BASE_URL}/users/profile-image/${message.author.user.profile_picture}/${token}`}
													onError={(e) => {
														e.currentTarget.src = UserProfilePicture;
													}}
													alt="A profile photo of the current user"
												/>
												<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
													<div style={{ color: 'blue' }}>
														{message.author.user.username}
													</div>
													<div style={{ width: '100%' }}>
														{splitLongWords(message.message)}
													</div>
												</div>
											</div>
										</Col>
									</Row>
								);
							}
						})
					)}
					<div ref={messageEndRef} />
				</MessageParent>
			</MessageSendDiv>
		</>
	);
}

export default MessageInbox;