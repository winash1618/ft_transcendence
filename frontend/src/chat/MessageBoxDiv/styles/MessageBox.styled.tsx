import styled from "styled-components";

export const MessageBox = styled.div`
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