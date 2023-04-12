import { useEffect, useState } from "react";
import { DropdownField } from "../LeftSideDiv/styles/LeftsideDiv.styled";
import { ErrorMessage } from "../LeftSideDiv/styles/CreateChannelFormDiv.styled";
import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface DropDownDivProps {
	openMenuId: any;
	user: any;
	dropDownContent: any;
	createDirectChat: any;
	handleLeaveChannel: any;
	handleNewPasswordSubmit: any;
	handleRemovePassword: any;
	handleMakeAdmin: any;
	handleBanUser: any;
	handleMuteUser: any;
	handleKickUser: any;
	handleDirectBlock: any;
}

function DropDownDiv(
	{
		openMenuId,
		user,
		dropDownContent,
		createDirectChat,
		handleLeaveChannel,
		handleNewPasswordSubmit,
		handleRemovePassword,
		handleMakeAdmin,
		handleBanUser,
		handleMuteUser,
		handleKickUser,
		handleDirectBlock,
	}: DropDownDivProps) {
	const [password, setPassword] = useState('');
	const [selectedUserLogin, setSelectedUserLogin] = useState(null);
	const [isPasswordChange, setIsPasswordChange] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		setSelectedUserLogin(null);
		setPassword('');
		setIsPasswordChange(false);
		setError('');
	}, [openMenuId]);

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

	const handleNewPassword = (password) => {
		handleNewPasswordSubmit(password);
		setIsPasswordChange((isPasswordChange === false) ? true : false);
	}

	const handleDropdown = (e, user) => {
		setSelectedUserLogin(user.login);
		if (e.target.innerText === "chat") {
			createDirectChat(user);
		}
		else if (e.target.innerText === "block") {
			handleDirectBlock(user);
			console.log("block");
		}
		else if (e.target.innerText === "invite") {
			console.log("invite");
		}
		else if (e.target.innerText === "view profile") {
			console.log("view profile");
		}
		else if (e.target.innerText === "Leave Channel") {
			console.log("leave channel");
			handleLeaveChannel();
		}
		else if (e.target.innerText === "Change Password") {
			setIsPasswordChange((isPasswordChange === false) ? true : false);
			console.log("change password");
		}
		else if (e.target.innerText === "Remove Password") {
			console.log("remove password");
			if (window.confirm("Are you sure you want to remove the password this will make the channel Public?")) {
				console.log("removing password");
				handleRemovePassword();
			} else {
				console.log("not removing password");
			}
		}
		else if (e.target.innerText === "Add Password") {
			setIsPasswordChange((isPasswordChange === false) ? true : false);
			console.log("add password");
		}
		else if (e.target.innerText === "Kick") {
			handleKickUser(user);
			console.log("kick");
		}
		else if (e.target.innerText === "Ban") {
			handleBanUser(user);
			console.log("ban");
		}
		else if (e.target.innerText === "Mute") {
			handleMuteUser(user);
			console.log("mute");
		}
		else if (e.target.innerText === "Make Admin") {
			console.log("make admin");
			handleMakeAdmin(user);
		}
	}
	return (
		<>
			<DropdownMenu>
				<DropdownContent open={openMenuId === user.login}>
					{
						dropDownContent.map((item) => (
							<DropdownItem key={item} onClick={(e) => handleDropdown(e, user)} >{item}</DropdownItem>
						))
					}
				</DropdownContent>
				{
					(selectedUserLogin === user.login && isPasswordChange) ?
						<DropdownField>
							<input
								type="password"
								placeholder="Password"
								value={password}
								onChange={handlePasswordChange}
								required
							/>
							<button onClick={() => handleNewPassword(password)}>Submit</button>
						</DropdownField>
						: null
				}
				{error && <ErrorMessage>{error}</ErrorMessage>}
			</DropdownMenu>
		</>
	);
}



export default DropDownDiv;