import { BsSend } from "react-icons/bs";
import styled from "styled-components";

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