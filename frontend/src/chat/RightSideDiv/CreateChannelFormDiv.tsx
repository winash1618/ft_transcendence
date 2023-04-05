
import { useState } from "react";
import { CreateChannelButton, CreateChannelFormContainer, CreateChannelInput, CreateChannelInputContainer, CreateChannelLabel, CreateChannelOption, CreateChannelSelect } from "./styles/CreateChannelFormDiv.styled";
import { Heading2 } from "./styles/Conversation.styled";
interface CreateChannelFormDivProps {
	handleChannelCreation: any;
}

function CreateChannelFormDiv({ handleChannelCreation }: CreateChannelFormDivProps) {
	const [showProtected, setShowProtected] = useState(false);
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleStatusChange = (event) => {
		setShowProtected(event.target.value === "protected");
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

	const handleSubmit = (event) => {
		event.preventDefault();
		if (error.length > 0) {
			return;
		}
		handleChannelCreation(event);
		setShowProtected(false);
	};
	return (
		<>
			<CreateChannelFormContainer>
				<Heading2>Create Channel</Heading2>
				<CreateChannelInputContainer>
					<CreateChannelLabel htmlFor="channel-name">channel_name:</CreateChannelLabel>
					<CreateChannelInput type="text" id="channel-name" name="channel-name" required />
				</CreateChannelInputContainer>
				<CreateChannelInputContainer>
					<CreateChannelLabel htmlFor="channel-status">status:</CreateChannelLabel>
					<CreateChannelSelect id="channel-status" name="channel-status" onChange={handleStatusChange} required>
						<CreateChannelOption value="private">Private</CreateChannelOption>
						<CreateChannelOption value="public">Public</CreateChannelOption>
						<CreateChannelOption value="protected">Protected</CreateChannelOption>
					</CreateChannelSelect>
				</CreateChannelInputContainer>
				<CreateChannelInputContainer>
					{
						showProtected ? (
							<>
								<CreateChannelLabel htmlFor="channel-password">password:</CreateChannelLabel>
								<CreateChannelInput
									type="password"
									id="password"
									value={password}
									onChange={handlePasswordChange}
									required
								/>
								{error && <p className="error">{error}</p>}
							</>
						) : null
					}
				</CreateChannelInputContainer>
				<CreateChannelButton type="submit" onClick={(e) => handleSubmit(e)}>Submit</CreateChannelButton>
			</CreateChannelFormContainer>
		</>
	);
}

export default CreateChannelFormDiv;