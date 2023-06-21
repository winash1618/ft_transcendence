import styled from "styled-components";
import { Select } from "antd";

export const FormContainer = styled.form`
  width: 100%;
  height: 100%;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormDetails = styled.div`
  width: 100%;
  max-width: 373px;
`;

export const InputController = styled.div`
  margin-bottom: 2rem;
`;

export const FormButton = styled.button`
  background-color: var(--blue-500);
  width: 100%;
  height: 58px;
  line-height: 58px;
  border: none;
  border-radius: 3px;
  color: white;
  font-size: 0.87rem;
  cursor: pointer;
  margin-top: 12px;
`;

export const FormInputTitle = styled.label`
  display: block;
  font-weight: 700;
  font-size: 1rem;
  line-height: 17px;
  margin-bottom: 6px;
`;

export const FormTitle = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 2.25rem;
  line-height: 30px;
  padding-right: 10px;
  /* border-right: 1px solid #000; */
  letter-spacing: 1px;
  margin-bottom: 3rem;
`;

export const FormSelect = styled(Select)`
  width: 100%;
`;

export const FormSwitchMsg = styled.p`
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 18px;
  margin-top: 15px;
  text-align: center;
`;

export const InputAlert = styled.p`
  color: #cdcdcd;
  padding-top: 6px;
`;

export const SearchingWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-direction: column;
`;

export const LeaderboardContainer = styled.div`
width: 20rem;
min-width: 20rem;

`;

export const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f5f5f5;
`;

export const LeaderboardRank = styled.span`
  font-weight: bold;
  margin-right: 1rem;

`;

export const LeaderboardAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  margin-left: 1rem;
`;

export const LeaderboardName = styled.span`
  flex-grow: 1;
  margin-left: 1rem;
`;

export const LeaderboardScore = styled.span`
  font-weight: bold;
  margin-left: 1rem;
`;
