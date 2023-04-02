import styled from "styled-components";

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
  width: 23%;
  height: 100%;
  overflow: auto;
`;

export const MessageBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1A1D1F;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  margin: auto;
  width: 55%;
  height: 100%;
`;

export const RightSideDiv = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: flex-start;
width: 18%;
height: 100%;
background-color: #1A1D1F;
border-radius: 15px;
padding: 10px;
overscroll-behavior: contain;
overflow: auto;
`;
