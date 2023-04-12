import { BsSend } from "react-icons/bs";
import styled from "styled-components";

// mobile styles
const mobileMaxWidth = "599px";

// tablet styles
const tabletMinWidth = "600px";
const tabletMaxWidth = "899px";

// pc styles
const pcMinWidth = "900px";

export const MessageInputParent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  align-items: center;
  justify-content: center;
  padding-right: 30px;
  padding-left: 10px;
  
  @media (max-width: ${mobileMaxWidth}) {
    flex-direction: column;
    align-items: flex-start;
    padding-right: 10px;
    padding-left: 10px;
  }
`;

export const SendButton = styled(BsSend)`
  color: white;
  ${MessageInputParent}:hover & {
    fill: #00A551;
  }
`;

export const Input = styled.input.attrs(props => ({
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

  @media (max-width: ${mobileMaxWidth}) {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
    margin-bottom: 10px;
  }

  @media (min-width: ${tabletMinWidth}) and (max-width: ${tabletMaxWidth}) {
    width: 60%;
  }

  @media (min-width: ${pcMinWidth}) {
    width: 50%;
  }
`;

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