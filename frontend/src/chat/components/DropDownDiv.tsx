import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface DropDownDivProps {
	openMenuId: any;
	user: any;
	dropDownContent: any;
	createDirectChat: any;
}

function DropDownDiv({ openMenuId, user, dropDownContent, createDirectChat }: DropDownDivProps) {
	const handleDropdown = (e, user) => {
		console.log("e.target.innerText: ", e.target.innerText);
		console.log("key ", e);
		if (e.target.innerText === "chat") {
			createDirectChat(user);
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