import { DropdownContent, DropdownItem, DropdownMenu } from "./styles/DropDownDiv.styled";

interface DropDownDivProps {
	openMenuId: any;
	user: any;
	dropDownContent: any;
}

function DropDownDiv({ openMenuId, user, dropDownContent }: DropDownDivProps) {
	return (
		<>
			<DropdownMenu>
				<DropdownContent open={openMenuId === user.login}>
					{dropDownContent.map((item) => (
						<DropdownItem key={item}>{item}</DropdownItem>
					))}
				</DropdownContent>
			</DropdownMenu>
		</>
	);
}



export default DropDownDiv;