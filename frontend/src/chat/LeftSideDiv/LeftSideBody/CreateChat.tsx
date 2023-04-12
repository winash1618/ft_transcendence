import { useEffect, useState } from "react";
import { CreateChannelButton, CreateChannelFormContainer, CreateChannelInput, CreateChannelInputContainer, CreateChannelLabel, CreateChannelOption, CreateChannelSelect, ErrorMessage, Heading2, ShowPasswordCheckbox, ShowPasswordLabel } from "../LeftSideDiv.styled";
import { Nav } from "../../chat.functions";

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

		const handleCreateChat = (event, password) => {
			event.preventDefault();
			const formData = new FormData(event.target.form);
			const channelName = formData.get('channel-name');
			const channelPrivacy = formData.get('channel-status');
			if (Boolean(String(channelName).trim()) === true)
			{
				console.log("channelName: ", channelName);
				console.log("channelPrivacy: ", channelPrivacy);
				socket?.emit('createConversation', { title: channelName, privacy: channelPrivacy, password: password })
				setNavbar(Nav.GROUPS);
			}
		};

		const handleStatusChange = (event) => {
			setShowProtected(event.target.value === "protected" || event.target.value === "private");
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
	
		const handleSubmit = (event, password) => {
			event.preventDefault();
			console.log("hi");
			if (error.length > 0 || (password.length === 0 && showProtected === true)) {
				return;
			}
			handleCreateChat(event, password);
			setShowProtected(false);
		};
	
	return (
		<>
			<CreateChannelFormContainer>
				<Heading2>Create Channel</Heading2>
				<CreateChannelInputContainer>
					<CreateChannelLabel htmlFor="channel-name">channel_name:</CreateChannelLabel>
					<CreateChannelInput type="text" id="channel-name" name="channel-name" required title="Please enter a channel name" />
				</CreateChannelInputContainer>
				<CreateChannelInputContainer>
					<CreateChannelLabel htmlFor="channel-status">status:</CreateChannelLabel>
					<CreateChannelSelect id="channel-status" name="channel-status" onChange={handleStatusChange} required>
						<CreateChannelOption value="PUBLIC">Public</CreateChannelOption>
						<CreateChannelOption value="PRIVATE">Private</CreateChannelOption>
						<CreateChannelOption value="PROTECTED">Protected</CreateChannelOption>
					</CreateChannelSelect>
				</CreateChannelInputContainer>
				{
					showProtected ? (
						<>
							<CreateChannelInputContainer>
								<CreateChannelLabel htmlFor="channel-password">password:</CreateChannelLabel>
								<CreateChannelInput
									type={showPassword ? "text" : "password"}
									id="password"
									value={password}
									onChange={handlePasswordChange}
									required
								/>
							</CreateChannelInputContainer>
							<ShowPasswordLabel htmlFor="show-password">
								<ShowPasswordCheckbox
									type="checkbox"
									id="show-password"
									onChange={() => setShowPassword(!showPassword)}
								/>
								<CreateChannelLabel htmlFor="show-password">Show Password</CreateChannelLabel>
							</ShowPasswordLabel>
							{error && <ErrorMessage>{error}</ErrorMessage>}
						</>
					) : null
				}
				<CreateChannelButton type="submit" onClick={(e) => handleSubmit(e, password)}>Submit</CreateChannelButton>
			</CreateChannelFormContainer>
		</>
	);
};

export default CreateChat;