import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import styled from "styled-components";

interface ContactDivProps {
	backgroundColor: string;
}
// create a styled div component that'll render a contact div
export const ContactDiv = styled.div<ContactDivProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 70px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 2px solid #00A551;
  background: ${({ backgroundColor }) => backgroundColor};
  &: active {
    transform: scale(0.9); /* Example of click effect: scale down to 90% */
	background: #00A551;
  }
`;

export const ContactImage = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 5px;
  border-radius: 50%;
  padding: 10px;
`;

export const ContactName = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
padding-top: 10px;
padding-left: 10px;
  color: white;
  font-size: 1em;
  border: 0px;
  border-radius: 15px;
  width: 150px;
  height: 50px;
`;

export const StyledTiLockOpen = styled(TiLockOpen)`
  margin-left: 10px;
`;

export const StyledTiLockClosed = styled(TiLockClosed)`
  margin-left: 10px;
`;

export const DropdownField = styled.div`
position: relative;
display: inline-block;

input[type='password'] {
	padding: 10px;
	border-radius: 5px;
	background-color: #555;
	border: none;
	margin-bottom: 20px;
	margin-right: 10px;
	flex: 2;
}

button {
	padding: 10px 20px;
	background-color: #008CBA;
	color: #fff;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	margin-left: auto;
	margin-right: auto;
  
	&:hover {
	  background-color: #00688B;
	}
}
}
`;