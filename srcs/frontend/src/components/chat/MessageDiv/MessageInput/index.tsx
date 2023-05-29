
import { Button, Input } from "antd";
import { BsSend } from "react-icons/bs";

interface MessageInputProps {
	message: any;
	setMessage: any;
	handleSubmit: any;
}

function MessageInput(
	{
		message,
		setMessage,
		handleSubmit,
	}: MessageInputProps) {
	return (
		<>
			<div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 'auto', alignItems: 'center', justifyContent: 'center', paddingRight: '30px', paddingLeft: '10px' }}>
				<Input
					type="text"
					placeholder="Enter your message..."
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleSubmit(event);
						}
					}}
					size="large"
					style={{ flex: 1, marginRight: '10px' }}
				/>
				<Button type="primary" icon={<BsSend size={24}/>} size="large" onClick={(e) => handleSubmit(e)} />
			</div>
		</>
	);
}

export default MessageInput;
