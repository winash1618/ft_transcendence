import { IoIosArrowDropdownCircle, IoIosArrowDropdown } from "react-icons/io";
import { DropdownButton } from "./styles/DropDownButton.styled";

interface DropdownButtonDivProps {
	user: any;
	openMenuId: any;
	setIsOpen: any;
	setOpenMenuId: any;
}

function DropdownButtonDiv({ user, openMenuId, setIsOpen, setOpenMenuId }: DropdownButtonDivProps) {

	const toggleMenu = (id) => {
		setOpenMenuId(openMenuId === id ? null : id);
		setIsOpen(openMenuId === id ? false : true);
	};
	return (
		<>
			<DropdownButton onClick={() => toggleMenu(user.login)}> {openMenuId === user.login ? (
				<IoIosArrowDropdown size={24} />
			) : (
				<IoIosArrowDropdownCircle size={24} />
			)}</DropdownButton>
		</>
	);
}

export default DropdownButtonDiv;