import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  OnlineStatusWrapper,
  PersonalInfo,
  PersonalInfoFlex,
  PersonalInfoTitle,
  PersonalInfoWrapper,
  PersonalTitle,
  ProfilePersonalInfoContainer,
} from "./profilePersonalInfo.styled";

import { HiOutlineStatusOffline, HiOutlineStatusOnline } from "react-icons/hi";
import { FaGamepad } from "react-icons/fa";

const ProfilePersonalInfo = () => {
  const { user } = useAppSelector((state) => state.users);
  console.log(user);
  return (
    <ProfilePersonalInfoContainer>
      <PersonalInfoTitle>Personal Info</PersonalInfoTitle>
      <PersonalInfoFlex>
        <PersonalInfoWrapper>
          <PersonalTitle>First name</PersonalTitle>
          <PersonalInfo>{user.first_name}</PersonalInfo>
        </PersonalInfoWrapper>
        <PersonalInfoWrapper>
          <PersonalTitle>Last name</PersonalTitle>
          <PersonalInfo>{user.last_name}</PersonalInfo>
        </PersonalInfoWrapper>
      </PersonalInfoFlex>
      <PersonalInfoFlex>
        <PersonalInfoWrapper>
          <PersonalTitle>Intra login</PersonalTitle>
          <PersonalInfo>{user.login}</PersonalInfo>
        </PersonalInfoWrapper>
        <PersonalInfoWrapper>
          <PersonalTitle>Nick name</PersonalTitle>
          <PersonalInfo>{user.username}</PersonalInfo>
        </PersonalInfoWrapper>
      </PersonalInfoFlex>
      <PersonalInfoFlex>
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
      </PersonalInfoFlex>
    </ProfilePersonalInfoContainer>
  );
};

export default ProfilePersonalInfo;
