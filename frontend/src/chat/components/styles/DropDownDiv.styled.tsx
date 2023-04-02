import styled from "styled-components";

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


export const DropdownItem = styled.a`
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background-color: #1a1d1f;
  color: white;

  &:hover {
    background-color: #212427;
  }
`;