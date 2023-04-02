import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface DropDownDivProps {
	openMenuId: any;
	user: any;
}

function DropDownDiv({ openMenuId, user }: DropDownDivProps) {
	return (
		<>
			<DropdownMenu>
				<DropdownContent open={openMenuId === user.login}>
					<DropdownItem href="#">Option 1</DropdownItem>
					<DropdownItem href="#">Option 2</DropdownItem>
					<DropdownItem href="#">Option 3</DropdownItem>
				</DropdownContent>
			</DropdownMenu>
		</>
	);
}



export default DropDownDiv;