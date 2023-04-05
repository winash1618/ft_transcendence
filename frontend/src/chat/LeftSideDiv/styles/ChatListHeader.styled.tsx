import { BiCommentAdd } from 'react-icons/bi';
import styled from 'styled-components';


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

export const StyledBiCommentAdd = styled(BiCommentAdd)`
  color: #00A551;
  font-size: 2em;
  margin-left: 1em;
  &: hover {
    cursor: pointer;
  }
  &: active {
    transform: scale(0.9); /* Example of click effect: scale down to 90% */
  }
`;
