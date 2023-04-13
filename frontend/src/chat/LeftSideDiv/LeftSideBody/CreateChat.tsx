import { useEffect, useState } from "react";
import { CreateChannelButton, CreateChannelFormContainer, CreateChannelInput, CreateChannelInputContainer, CreateChannelLabel, CreateChannelOption, CreateChannelSelect, ErrorMessage, Heading2, ShowPasswordCheckbox, ShowPasswordLabel } from "../LeftSideDiv.styled";
import { Nav } from "../../chat.functions";
import { Form, Input, Button, Select, Checkbox, Row, Col } from 'antd';
const { Option } = Select;
interface CreateChatProps {
	socket: any;
	setNavbar: any;
}

const CreateChat = ({
	socket,
	setNavbar,
}: CreateChatProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showProtected, setShowProtected] = useState(false);
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleCreateChat = (channelName, channelPrivacy, password) => {
		if (Boolean(String(channelName).trim()) === true) {
			socket?.emit('createConversation', { title: channelName, privacy: channelPrivacy, password: password });
			setNavbar(Nav.GROUPS);
		}
	};

	const handleStatusChange = (value) => {
		console.log(value);
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

	// 	return (
	// 		<>
	// 			<CreateChannelFormContainer>
	// 				<Heading2>Create Channel</Heading2>
	// 				<CreateChannelInputContainer>
	// 					<CreateChannelLabel htmlFor="channel-name">channel_name:</CreateChannelLabel>
	// 					<CreateChannelInput type="text" id="channel-name" name="channel-name" required title="Please enter a channel name" />
	// 				</CreateChannelInputContainer>
	// 				<CreateChannelInputContainer>
	// 					<CreateChannelLabel htmlFor="channel-status">status:</CreateChannelLabel>
	// 					<CreateChannelSelect id="channel-status" name="channel-status" onChange={handleStatusChange} required>
	// 						<CreateChannelOption value="PUBLIC">Public</CreateChannelOption>
	// 						<CreateChannelOption value="PRIVATE">Private</CreateChannelOption>
	// 						<CreateChannelOption value="PROTECTED">Protected</CreateChannelOption>
	// 					</CreateChannelSelect>
	// 				</CreateChannelInputContainer>
	// 				{
	// 					showProtected ? (
	// 						<>
	// 							<CreateChannelInputContainer>
	// 								<CreateChannelLabel htmlFor="channel-password">password:</CreateChannelLabel>
	// 								<CreateChannelInput
	// 									type={showPassword ? "text" : "password"}
	// 									id="password"
	// 									value={password}
	// 									onChange={handlePasswordChange}
	// 									required
	// 								/>
	// 							</CreateChannelInputContainer>
	// 							<ShowPasswordLabel htmlFor="show-password">
	// 								<ShowPasswordCheckbox
	// 									type="checkbox"
	// 									id="show-password"
	// 									onChange={() => setShowPassword(!showPassword)}
	// 								/>
	// 								<CreateChannelLabel htmlFor="show-password">Show Password</CreateChannelLabel>
	// 							</ShowPasswordLabel>
	// 							{error && <ErrorMessage>{error}</ErrorMessage>}
	// 						</>
	// 					) : null
	// 				}
	// 				<CreateChannelButton type="submit" onClick={(e) => handleSubmit(e, password)}>Submit</CreateChannelButton>
	// 			</CreateChannelFormContainer>
	// 		</>
	// 	);
	// };

	// return (
	//     <Form
	//       name="create-channel-form"
	//       onFinish={(values) => handleSubmit(values.channelName, values.channelStatus, password)}
	//       layout="vertical"
	//     >
	//       <Form.Item label="Channel Name" name="channelName" rules={[{ required: true, message: 'Please enter a channel name' }]}>
	//         <Input />
	//       </Form.Item>

	//       <Form.Item label="Status" name="channelStatus" rules={[{ required: true, message: 'Please select a status' }]}>
	//         <Select onChange={handleStatusChange}>
	//           <Option value="PUBLIC">Public</Option>
	//           <Option value="PRIVATE">Private</Option>
	//           <Option value="PROTECTED">Protected</Option>
	//         </Select>
	//       </Form.Item>

	//       {showProtected && (
	//         <>
	//           <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
	//             <Input.Password value={password} onChange={handlePasswordChange} />
	//           </Form.Item>


	//           {error && <div style={{ color: 'red' }}>{error}</div>}
	//         </>
	//       )}

	//       <Form.Item>
	//         <Button type="primary" htmlType="submit">
	//           Submit
	//         </Button>
	//       </Form.Item>
	//     </Form>
	//   );
	// };


	return (
		<Form
			name="create-channel-form"
			onFinish={(values) => handleSubmit(values.channelName, values.channelStatus, password)}
			layout="vertical"
			style={{ padding: '0 50px' }}
		>
			<Row gutter={16}>
				<Col span={24}>
					<Form.Item
						label="Channel Name"
						name="channelName"
						rules={[{ required: true, message: 'Please enter a channel name' }]}>
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={24}>
					<Form.Item label="Status" name="channelStatus" rules={[{ required: true, message: 'Please select a status' }]}>
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
							<Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password' }]}>
								<Input.Password value={password} onChange={handlePasswordChange} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={24}>
							<Form.Item>
								<Checkbox id="show-password" checked={showPassword} onChange={() => setShowPassword(!showPassword)}>
									Show Password
								</Checkbox>
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