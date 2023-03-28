import { Typography } from "antd";
import styled from "styled-components";
const { Text } = Typography;

export const ProfileContainer = styled.div`
  padding: 50px;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const ProfileHeader = styled.div`
  background: var(--main-700);
  border-radius: 10px;
  padding: 120px 0px 20px 40px;
  position: relative;
  display: flex;
  align-items: end;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 150px 0px 0px 0px;
  }
`;

export const ProfileBackground = styled.div`
  width: 100%;
  height: 60%;
  z-index: 10;
  top: 0;
  left: 0;
  position: absolute;
  @media (max-width: 768px) {
    height: 56%;
  }
`;

export const ProfileButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

export const ProfilePicture = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  align-items: end;
  gap: 20px;
  z-index: 15;
  position: relative;
  @media (max-width: 768px) {
    gap: 15px;
  }
`;

export const ProfileInfoWrapper = styled.div`
  padding-bottom: 20px;
  @media (max-width: 768px) {
    padding-bottom: 5px;
  }
`;

export const UserName = styled(Typography)`
  text-transform: capitalize;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 0;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const UserRating = styled(Text)`
  text-transform: capitalize;
  font-size: 0.8rem;
  color: #fff !important;
  margin-bottom: 0;
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;
