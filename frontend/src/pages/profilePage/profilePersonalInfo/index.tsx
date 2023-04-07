import { useAppSelector } from "../../../hooks/reduxHooks";
import {
	CustomCol,
  CustomRow,
  OnlineStatusWrapper,
  PersonalInfo,
  PersonalInfoTitle,
  PersonalTitle,
  ProfilePersonalInfoContainer,
} from "./profilePersonalInfo.styled";

import { HiOutlineStatusOffline, HiOutlineStatusOnline } from "react-icons/hi";
import { FaGamepad } from "react-icons/fa";
import { Col, Row } from "antd";

const ProfilePersonalInfo = () => {
  const { user } = useAppSelector((state) => state.users);
  console.log(user);
  return (
    <ProfilePersonalInfoContainer>
      <PersonalInfoTitle>Personal Info</PersonalInfoTitle>
      <CustomRow>
        <CustomCol span={8} offset={4}>
          <PersonalTitle>First name</PersonalTitle>
          <PersonalInfo>{user.first_name}</PersonalInfo>
        </CustomCol>
        <CustomCol span={9} offset={2}>
          <PersonalTitle>Last name</PersonalTitle>
          <PersonalInfo>{user.last_name}</PersonalInfo>
        </CustomCol>
      </CustomRow>
      <CustomRow>
        <CustomCol span={8} offset={4}>
          <PersonalTitle>Intra login</PersonalTitle>
          <PersonalInfo>{user.login}</PersonalInfo>
        </CustomCol>
        <CustomCol span={9} offset={2}>
          <PersonalTitle>Nick name</PersonalTitle>
          <PersonalInfo>{user.username}</PersonalInfo>
        </CustomCol>
      </CustomRow>
      <Row>
        {user.user_status === "ONLINE" ? (
          <OnlineStatusWrapper>
            <PersonalTitle>Online</PersonalTitle>
            <HiOutlineStatusOnline />
          </OnlineStatusWrapper>
        ) : user.user_status === "OFFLINE" ? (
          <OnlineStatusWrapper>
            <PersonalTitle>Offline</PersonalTitle>
            <HiOutlineStatusOffline />
          </OnlineStatusWrapper>
        ) : (
          <OnlineStatusWrapper>
            <PersonalTitle>In game</PersonalTitle>
            <FaGamepad />
          </OnlineStatusWrapper>
        )}
      </Row>
    </ProfilePersonalInfoContainer>
  );
};

export default ProfilePersonalInfo;
