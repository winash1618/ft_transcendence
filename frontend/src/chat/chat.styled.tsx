import styled from "styled-components";

export const ParentContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 80vh;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export const LeftSideContainer = styled.div`
  display: flex;
  color: #1A1D1F;
  flex-direction: column;
  background-color: #1A1D1F;
  border-radius: 15px;
  margin: auto;
  width: 23%;
  height: 100%;
  overflow: auto;

  @media (max-width: 768px) {
    width: 100%;
	margin: 0 0 20px 0;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    height: 50vh;
  }
`;

export const RightSideContainer = styled.div`
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

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    margin-top: 20px;
  }
`;