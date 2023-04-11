import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDropdownCircle } from "react-icons/io";



const ContactDiv = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
`;


const DropdownMenu = styled.div`
  position: relative;
  display: inline-block;
`;

interface DropdownContentProps {
	  open: boolean;
	}

const DropdownContent = styled.div<DropdownContentProps>`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  display: ${({ open }) => (open ? "block" : "none")};
`;

const DropdownItem = styled.a`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const DropdownButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(null);

  const toggleMenu = () => {if (isOpen === 1) {setIsOpen(null)} else {setIsOpen(2)}; setIsOpen(1)};

  return (
    <div>
      <ContactDiv >
        <DropdownButton onClick={toggleMenu} ><IoIosArrowDropdownCircle size={24} /></DropdownButton>
      </ContactDiv>
      <DropdownMenu>
        <DropdownContent open={(isOpen === 1) ? true: false}>
          <DropdownItem href="#">Option 1</DropdownItem>
          <DropdownItem href="#">Option 2</DropdownItem>
          <DropdownItem href="#">Option 3</DropdownItem>
        </DropdownContent>
      </DropdownMenu>
      <ContactDiv >
        <DropdownButton onClick={toggleMenu}>v</DropdownButton>
      </ContactDiv>
      <DropdownMenu>
        <DropdownContent open={(isOpen === 2) ? true: false}>
          <DropdownItem href="#">Option 1</DropdownItem>
          <DropdownItem href="#">Option 2</DropdownItem>
          <DropdownItem href="#">Option 3</DropdownItem>
        </DropdownContent>
      </DropdownMenu>
      <ContactDiv >
        <DropdownButton onClick={toggleMenu}>v</DropdownButton>
      </ContactDiv>
      <DropdownMenu>
        <DropdownContent open={(isOpen === 3) ? true: false}>
          <DropdownItem href="#">Option 1</DropdownItem>
          <DropdownItem href="#">Option 2</DropdownItem>
          <DropdownItem href="#">Option 3</DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </div>
  );
};

export default HomePage;
