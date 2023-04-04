import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface DropDownDivProps {
	openMenuId: any;
	user: any;
	dropDownContent: any;
	createDirectChat: any;
}

function DropDownDiv({ openMenuId, user, dropDownContent, createDirectChat }: DropDownDivProps) {
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