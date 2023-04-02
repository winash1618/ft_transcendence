import styled from 'styled-components';

interface CreateConversationDivProps {
	backgroundColor: string;
}

export const CreateConversationDiv = styled.div<CreateConversationDivProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 70px;
  border-radius: 10px;
  margin-top: 10px;
  border: 2px solid #00A551;
  color: #00A551;
  padding-left: 10px;
  background: ${({ backgroundColor }) => backgroundColor};
  :hover & {
	cursor: pointer;
	background: #00A551  !important;
	}
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