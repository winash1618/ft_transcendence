
import { CreateChannelButton, CreateChannelFormContainer, CreateChannelInput, CreateChannelLabel, CreateChannelOption, CreateChannelSelect } from "./styles/CreateChannelFormDiv.styled";
interface CreateChannelFormDivProps {
	handleChannelCreation: any;
}

function CreateChannelFormDiv({ handleChannelCreation }: CreateChannelFormDivProps) {
	return (
		<>
			<CreateChannelFormContainer>
				<CreateChannelLabel htmlFor="channel-name">Channel Name:</CreateChannelLabel>
				<CreateChannelInput type="text" id="channel-name" name="channel-name" required />
				<CreateChannelLabel htmlFor="channel-status">Channel Status:</CreateChannelLabel>
				<CreateChannelSelect id="channel-status" name="channel-status" required>
					<CreateChannelOption value="private">Private</CreateChannelOption>
					<CreateChannelOption value="public">Public</CreateChannelOption>
					<CreateChannelOption value="protected">Protected</CreateChannelOption>
				</CreateChannelSelect>
				<CreateChannelButton type="submit" onClick={(e) => handleChannelCreation(e)}>Submit</CreateChannelButton>
			</CreateChannelFormContainer>
		</>
	);
}

export default CreateChannelFormDiv;