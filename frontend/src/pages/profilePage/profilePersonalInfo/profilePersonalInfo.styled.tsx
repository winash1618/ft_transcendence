import { Col, Row } from "antd";
import styled from "styled-components";

export const ProfilePersonalInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--main-700);
  margin: 50px 0px;
  border-radius: 10px;
  width: 100%;
  padding: 30px 0px;
  max-width: 600px;
`;

export const PersonalTitle = styled.h1`
  font-size: 1.1rem;
  text-align: left;
`;

export const CustomRow = styled(Row)`
	margin: 30px;
	@media (max-width: 500px)
	{
		margin: 10px;
	}
`

export const PersonalInfo = styled.p`
  font-size: 0.9rem;
`;

export const CustomCol = styled(Col)`
	width: 240px;
`

export const OnlineStatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px;
`;

export const PersonalInfoTitle = styled.h1`
  font-size: 2rem;
  padding-bottom: 20px;
`;
