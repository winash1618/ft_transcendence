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

  @media screen and (max-width: 768px) {
    padding: 5px;
  }
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

  @media screen and (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }

  @media screen and (max-width: 480px) {
    padding: 8px;
    font-size: 12px;
  }
`;
