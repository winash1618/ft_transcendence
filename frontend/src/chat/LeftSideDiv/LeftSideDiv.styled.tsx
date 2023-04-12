import styled from 'styled-components';

import { TiLockClosed, TiLockOpen } from "react-icons/ti";

export const CreateChannelFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin: 50px;
  max-width: 500px;
  margin: auto;

  @media screen and (min-width: 768px) {
    max-width: 700px;
  }

  @media screen and (min-width: 1024px) {
    max-width: 900px;
  }
`;

export const Heading2 = styled.h2`
  font-size: 2rem;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
`;

export const CreateChannelLabel = styled.label`
  font-size: 1rem;
  margin-right: 10px;
  color: #555;
  flex: 1;

  @media screen and (min-width: 768px) {
    margin-right: 20px;
  }
`;

export const CreateChannelInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  background-color: #555;
  border: none;
  margin-bottom: 20px;
  flex: 2;

  @media screen and (min-width: 768px) {
    margin-left: 10px;
    margin-bottom: 0;
  }
  
  @media screen and (min-width: 1024px) {
    flex: 3;
  }
`;

export const CreateChannelSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  background-color: #555;
  border: none;
  margin-bottom: 20px;
  flex: 2;

  @media screen and (min-width: 768px) {
    margin-left: 10px;
    margin-bottom: 0;
  }
  
  @media screen and (min-width: 1024px) {
    flex: 3;
  }
`;

export const CreateChannelOption = styled.option`
  font-size: 1rem;
`;

export const CreateChannelButton = styled.button`
  padding: 10px 20px;
  background-color: #008CBA;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto;
  margin-right: auto;
  display: block;

  &:hover {
    background-color: #00688B;
  }
`;

export const CreateChannelInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  margin-bottom: 20px;
`;

export const ShowPasswordLabel = styled.label`
  margin-bottom: 10px;
`;

export const ShowPasswordCheckbox = styled.input`
  margin-right: 8px;
`;



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