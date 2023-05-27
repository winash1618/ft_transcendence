import { useState } from "react";
import { Form, Input, Button, Select, Row, Col } from 'antd';
const { Option } = Select;

interface CreateChatProps {
	socket: any;
}

const CreateChat = ({
	socket,
}: CreateChatProps) => {
	const [showProtected, setShowProtected] = useState(false);
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [form] = Form.useForm();

	const handleCreateChat = (channelName, channelPrivacy, password) => {
		if (Boolean(String(channelName).trim()) === true) {
			socket?.emit('createConversation', { title: channelName, privacy: channelPrivacy, password: password });
			setPassword('');
			setError('');
			form.resetFields(['channelStatus']);
			form.resetFields(['channelName']);
			form.resetFields(['password']);
		}
	};

	const handleStatusChange = (value) => {
		setShowProtected(value === "PROTECTED" || value === "PRIVATE");
	};

	const handlePasswordChange = (event) => {
		const value = event.target.value;
		setPassword(value);
		validatePassword(value);
	};

	const validatePassword = (value) => {
		if (value.length < 8) {
			setError('Password must be at least 8 characters long');
		} else if (!/\d/.test(value)) {
			setError('Password must contain at least one digit');
		} else if (!/[a-z]/.test(value)) {
			setError('Password must contain at least one lowercase letter');
		} else if (!/[A-Z]/.test(value)) {
			setError('Password must contain at least one uppercase letter');
		} else if (!/[!@#$%^&*]/.test(value)) {
			setError('Password must contain at least one special character');
		} else {
			setError('');
		}
	};

	const handleSubmit = (channelName, channelStatus, password) => {
		if (error.length > 0 || (password.length === 0 && channelStatus === "PROTECTED")) {
			return;
		}
		handleCreateChat(channelName, channelStatus, password);
		setShowProtected(false);
	};

	return (
		<Form
			name="create-channel-form"
			onFinish={(values) => handleSubmit(values.channelName, values.channelStatus, password)}
			layout="vertical"
			style={{ padding: '0 50px' }}
			form={form}
		>
			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						label={<div style={{ color: 'white' }}>channel name</div>}
						name="channelName"
						rules={[{ required: true, message: 'Please enter a channel name' }]}>
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={24}>
					<Form.Item label={<div style={{ color: 'white' }}>Status</div>} name="channelStatus" rules={[{ required: true, message: 'Please select a status' }]}>
						<Select onChange={handleStatusChange}>
							<Option value="PUBLIC">Public</Option>
							<Option value="PRIVATE">Private</Option>
							<Option value="PROTECTED">Protected</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>

			{showProtected && (
				<>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item label={<div style={{ color: 'white' }}>password</div>} name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
								<Input.Password value={password} onChange={handlePasswordChange} />
							</Form.Item>
						</Col>
					</Row>

					{error && (
						<Row gutter={16}>
							<Col span={24}>
								<div style={{ color: 'red' }}>{error}</div>
							</Col>
						</Row>
					)}
				</>
			)}

			<Row gutter={16}>
				<Col span={24}>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};
export default CreateChat;