
import { MessageParent, MessageSendDiv } from "../MessageDiv.styled";
import { Avatar, Col, Row } from "antd";

interface MessageInboxProps {
	sender: any;
	user: any;
	messages: any;
	messageEndRef: any;
	UserProfilePicture: any;
}

function MessageInbox(
	{
		sender,
		user,
		messages,
		messageEndRef,
		UserProfilePicture,
	}: MessageInboxProps) {
	return (
		<>
			<MessageSendDiv>
				<MessageParent>
					{(
						messages.map((message) => {
							if (sender.id === user.id) {
								return (
									<Row justify="end" style={{ marginBottom: '1em', marginTop: '1em' }}>
										<Col xs={24} sm={18} md={12} lg={8}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'flex-end',
													alignItems: 'center',
													background: '#111315',
													border: '1px solid #00A551',
													borderRadius: '15px',
													color: 'white',
													padding: '1em',
												}}
											>
												<div style={{ width: '100%', marginRight: '10px' }}>
													{message.message}
												</div>
												<Avatar
													src={UserProfilePicture}
													alt=""
													size={{ xs: 24, sm: 32, md: 40, lg: 48, xl: 56, xxl: 64 }}
												/>
											</div>
										</Col>
									</Row>
								);
							} else {
								return (
									<Row justify="start" style={{ marginBottom: '1em', marginTop: '1em' }}>
										<Col xs={24} sm={18} md={12} lg={8}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'flex-start',
													alignItems: 'center',
													background: '#e4e4e4',
													border: '1px solid #ddd',
													borderRadius: '15px',
													color: 'black',
													padding: '1em',
												}}
											>
												<Avatar
													src={UserProfilePicture}
													alt=""
													size={{ xs: 24, sm: 32, md: 40, lg: 48, xl: 56, xxl: 64 }}
													style={{ marginRight: '10px' }}
												/>
												<div style={{ width: '100%' }}>
													{message.message}
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