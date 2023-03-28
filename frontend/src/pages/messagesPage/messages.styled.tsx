import styled, { css } from "styled-components";
import { BsSend } from 'react-icons/bs';

export const ParentContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

export const ChatListContainer = styled.div`
  display: flex;
  color: #1A1D1F;
  flex-direction: column;
  background-color: #1A1D1F;
  border-radius: 15px;
  margin: auto;
  width: 28%;
  height: 100%;
`;

export const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1A1D1F;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  margin: auto;
  width: 50%;
  height: 100%;
`;

export const MessageSendDiv = styled.div`
  display: flex;
  margin: 1em;
  background: #1A1D1F;
  border: 1px white solid;
  border-radius: 15px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  height: 85%;
`;

export const MessageImage = styled.img`
  width: 70px;
  height: 70px;
  margin-right: 10px;
  border-radius: 50%;
  padding: 10px;
`;

export const MessageParent = styled.div`
  display: flex;
  overflow: auto;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: #1A1D1F;
  color: white;
  border-radius: 15px;
  padding: 1em;
`;

export const MessageRightContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: auto;
  background: #111315;
  border: 1px solid #00A551;
  color: white;
  border-radius: 15px;
  margin-left: auto;
  margin-bottom: 1em;
  margin-top: 1em;
  padding-left: 1em;
  padding-right: 1em;
`;

export const MessageLeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: auto;
  background: #111315;
  border: 1px solid #00A551;
  color: white;
  border-radius: 15px;
  margin-right: auto;
  margin-bottom: 1em;
  margin-top: 1em;
  padding-left: 1em;
  padding-right: 1em;
`;

export const MessageRight = styled.div`
  width: 100%;
  height: auto;
  color: white;
  margin-left: auto;
  padding-left: 1em;
  padding-right: 1em;
`;

export const MessageLeft = styled.div`
  width: 100%;
  height: auto;
  color: white;
  margin-right: auto;
  padding-left: 1em;
  padding-right: 1em;
`;

export const MessageInputParent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
  padding-right: 30px;
  padding-left: 10px;
`;

export const SendButton = styled(BsSend)`
  color: white;
  ${MessageInputParent}:hover & {
    fill: #00A551;
  }
`;

export const MessageInput = styled.input.attrs(props => ({
    // we can define static props
    type: "text",
  }))`
  background-color: #111315;
  width: 70%;
  height: 50px;
  border-radius: 10px;
  font-size: 1em;
  padding-left: 10px;
  margin-right: 10px;
  margin-left: 10px;
  border: 1px solid white;
  color: white;
  border-radius: 1em;
  flex: 1;
`;

export const ParentMessageNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 10px;
  border-bottom: 2px solid black;
`;

interface MessageNavProps {
	backgroundColor: string;
}

export const MessageNav = styled.button<MessageNavProps>`
  color: white;
  font-size: 1em;
  margin: 1em;
  background: ${({ backgroundColor }) => backgroundColor};
  border: 0px;
  border-radius: 15px;
  width: 150px;
  height: 50px;
`;

interface MessageNavNotUsedProps {
	backgroundColor: string;
}

// A new component based on Button, but with some override styles
export const MessageNavNotUsed = styled.button<MessageNavNotUsedProps>`
  color: white;
  font-size: 1em;
  margin: 1em;
  background: ${({ backgroundColor }) => backgroundColor};
  border-radius: 15px;
  border: 0px;
  width: 150px;
  height: 50px;
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
  margin-top: 10px;
  border: 2px solid #00A551;
  background: ${({ backgroundColor }) => backgroundColor};
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
flex-direction: column;
justify-content: center;
padding-left: 10px;
  color: white;
  font-size: 1em;
  border: 0px;
  border-radius: 15px;
  width: 150px;
  height: 50px;
`;


export const ParentUserListDiv = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
width: 18%;
height: 100%;
background-color: #1A1D1F;
border-radius: 15px;
padding: 10px;
`;

// export const UserFriendListDiv = styled.div`
export const UserListInput = styled.input.attrs({ type: "checkbox" })``;

export const UserListLabel = styled.label`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`
type LabelTextProps = {
	$mode: string;
  };
  
export const UserListLabelText = styled.span<LabelTextProps>`
 as ThemedStyledProps<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, any>;
  ${(props) => {
    switch (props.$mode) {
      case "dark":
        return css`
          background-color: black;
          color: white;
          ${UserListInput}:checked + && {
            color: blue;
          }
        `;
      default:
        return css`
          background-color: white;
          color: black;
          ${UserListInput}:checked + && {
            color: red;
          }
        `;
    }
  }}
`;

interface CreateConversationDivProps {
	backgroundColor: string;
}

export const CreateConversationDiv = styled.div<CreateConversationDivProps>`
  color: white;
  font-size: 1em;
  margin: 1em;
  border: 0px;
  padding-left: 30px;
  padding-top: 10px;
  border-radius: 15px;
  width: 90%;
  height: 50px;
  background: ${({ backgroundColor }) => backgroundColor};
`;