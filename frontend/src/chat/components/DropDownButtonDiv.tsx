import { IoIosArrowDropdownCircle, IoIosArrowDropdown } from "react-icons/io";
import { DropdownButton } from "./styles/DropDownButton.styled";

interface DropdownButtonDivProps {
	user: any;
	openMenuId: any;
	setOpenMenuId: any;
}

function DropdownButtonDiv({ user, openMenuId, setOpenMenuId }: DropdownButtonDivProps) {

	const toggleMenu = (id) => {
		setOpenMenuId(openMenuId === id ? null : id);
	};
	return (
		<>
			<DropdownButton onClick={() => toggleMenu(user.login)}> {openMenuId === user.login ? (
				<IoIosArrowDropdown size={24} />
			) : (
				<IoIosArrowDropdownCircle size={24} />
			)}
			</DropdownButton>
		</>
	);
}

export default DropdownButtonDiv;