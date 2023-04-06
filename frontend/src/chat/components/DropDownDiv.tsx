import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface DropDownDivProps {
	openMenuId: any;
	user: any;
	dropDownContent: any;
	createDirectChat: any;
	handleLeaveChannel: any;
}

function DropDownDiv({ openMenuId, user, dropDownContent, createDirectChat, handleLeaveChannel }: DropDownDivProps) {
	const handleDropdown = (e, user) => {
		if (e.target.innerText === "chat") {
			createDirectChat(user);
		}
		else if (e.target.innerText === "block") {
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
		else if (e.target.innerText === "change password") {
			console.log("change password");
		}
		else if (e.target.innerText === "remove password") {
			console.log("remove password");
		}
		else if (e.target.innerText === "kick") {
			console.log("kick");
		}
		else if (e.target.innerText === "ban") {
			console.log("ban");
		}
		else if (e.target.innerText === "mute") {
			console.log("mute");
		}
	}
	return (
		<>
			<DropdownMenu>
				<DropdownContent open={openMenuId === user.login}>
					{dropDownContent.map((item) => (
						<DropdownItem key={item} onClick={(e) => handleDropdown(e, user)} >{item}</DropdownItem>
					))}
				</DropdownContent>
			</DropdownMenu>
		</>
	);
}



export default DropDownDiv;