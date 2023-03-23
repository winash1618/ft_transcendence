import styled from "styled-components";
import { IoChevronDownOutline } from "react-icons/io5";
import { Typography } from "antd";
const { Text } = Typography;

export const ProfileWrapper = styled.div`
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  margin: 1rem 0 1rem 0;
`;

export const DropDownLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const UserInfoWrapper = styled.div`
  text-overflow: ellipsis;
  line-height: 1.4;
`;

export const UserName = styled(Typography)`
  text-transform: capitalize;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 0;
`;

export const UserLogin = styled(Text)`
  text-transform: capitalize;
  font-size: 0.7rem;
  color: #fff !important;
  margin-bottom: 0;
`;

export const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const ChevronIcon = styled(IoChevronDownOutline)`
  color: #fff;
  margin-left: 1rem;
`;