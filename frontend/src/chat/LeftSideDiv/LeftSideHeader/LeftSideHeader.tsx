import {
  ParentMessageNav,
  StyledBiCommentAdd,
  StyledHiOutlineUser,
  StyledHiOutlineUserGroup,
  StyledMdOutlineTravelExplore,
} from "../styles/LeftSideHeader.styled";
import { Nav, Colors } from "../../chat.functions";
import { useState } from "react";

interface LeftSideHeaderProps {
	Navbar: Nav;
	setNavbar: (nav: Nav) => void;
}

function LeftSideHeader({
	Navbar,
	setNavbar,
}: LeftSideHeaderProps) {

	

	function handleNavClick (nav: Nav) {
		setNavbar(nav);
	}



  return (
    <>
      <ParentMessageNav>
        <StyledHiOutlineUser
          onClick={() => handleNavClick(Nav.DIRECT)}
          color={Navbar === Nav.DIRECT ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />
        <StyledHiOutlineUserGroup
          onClick={() => handleNavClick(Nav.GROUPS)}
          color={Navbar === Nav.GROUPS ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />

        <StyledBiCommentAdd
          onClick={() => handleNavClick(Nav.EXPLORE)}
          color={Navbar === Nav.EXPLORE ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />
        <StyledMdOutlineTravelExplore
          onClick={() => handleNavClick(Nav.CREATE)}
          color={Navbar === Nav.CREATE ? Colors.WHITE : Colors.PRIMARY}
          size={30}
        />
      </ParentMessageNav>
    </>
  );
}

export default LeftSideHeader;
