import styled from "styled-components";

export const ParentContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

export const ChatListContainer = styled.div`
  display: flex;
  color: blue;
  flex-direction: column;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin: auto;
  width: 28%;
  height: 100%;
`;

export const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: blue;
  border-radius: 10px;
  margin: auto;
  width: 68%;
  height: 100%;
`;

export const ParentMessageNav = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #f5f5f5;
  border-radius: 10px;
  margin-top: 10px;
  width: 100%;
  height: 10%;
`;

export const MessageNav = styled.button`
  color: green;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// A new component based on Button, but with some override styles
export const MessageNavNotUsed = styled(MessageNav)`
  color: gray;
  border-color: darkgray;
`;



