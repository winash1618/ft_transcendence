
import React from "react";
import { useState } from "react";
import { IoIosArrowDropdownCircle, IoIosArrowDropdown } from "react-icons/io";
import styled from "styled-components";
import { ContactDiv, ContactImage, ContactName } from "./styles/GroupConversation.styled";

interface GroupConversationProps {
	groupMembers: any;
	otherUsers: any;
	user: any;
	contactDivColor: any;
	UserProfilePicture: any;
	handleAddUserToGroup: any;
}


export const DropdownMenu = styled.div`
  position: relative;
  background-color: #1a1d1f;
  border-top: none;
  border-radius: 0 0 10px 10px;
  width: 100%;
`;

interface DropdownContentProps {
	open: boolean;
}

export const DropdownContent = styled.div<DropdownContentProps>`
  display: ${({ open }) => (open ? "block" : "none")};
  padding: 10px;
`;


const DropdownItem = styled.a`
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background-color: #1a1d1f;
  color: white;

  &:hover {
    background-color: #212427;
  }
`;

const DropdownButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 10px;
`;

function GroupConversation({ groupMembers, otherUsers, user, contactDivColor, UserProfilePicture, handleAddUserToGroup }: GroupConversationProps) {
	const [openMenuId, setOpenMenuId] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = (id) => {
		setOpenMenuId(openMenuId === id ? null : id);
		setIsOpen(openMenuId === id ? false : true);
	};
	return (
		<>
			<h1>Group Chat</h1>
			<h2> Group Owner </h2>
			<ContactDiv key={user.login} backgroundColor={contactDivColor} isOpen={isOpen}>
				<ContactImage src={UserProfilePicture} alt="" />
				<ContactName>{user.login}</ContactName>
				<DropdownButton onClick={() => toggleMenu(user.login)}> {openMenuId === user.login ? (
					<IoIosArrowDropdown size={24} />
				) : (
					<IoIosArrowDropdownCircle size={24} />
				)}</DropdownButton>
			</ContactDiv>
			<DropdownMenu>
				<DropdownContent open={openMenuId === user.login}>
					<DropdownItem href="#">Option 1</DropdownItem>
					<DropdownItem href="#">Option 2</DropdownItem>
					<DropdownItem href="#">Option 3</DropdownItem>
				</DropdownContent>
			</DropdownMenu>
			<h2> Group Members </h2>
			{groupMembers.map((u) => {
				if (u.login !== user.login) {
					return (
						<ContactDiv key={u.login} backgroundColor={contactDivColor} isOpen={isOpen}>
							<ContactImage src={UserProfilePicture} alt="" />
							<ContactName>{u.login}</ContactName>
						</ContactDiv>
					);
				}
				return null; // always provide a fallback for conditional rendering
			})}
			<h2> Other Users</h2>
			{otherUsers.map((u) => {
				if (u.login !== user.login) {
					return (
						<ContactDiv key={u.login} backgroundColor={contactDivColor} onClick={(e) => handleAddUserToGroup(e)} isOpen={isOpen}>
							<ContactImage src={UserProfilePicture} alt="" />
							<ContactName>{u.login}</ContactName>
						</ContactDiv>
					);
				}
				return null; // always provide a fallback for conditional rendering
			})}
		</>
	);
}

export default GroupConversation;