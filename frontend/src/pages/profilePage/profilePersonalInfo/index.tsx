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

const ProfilePersonalInfo = () => {
  const { user } = useAppSelector((state) => state.users);
  const { userInfo } = useAppSelector((state) => state.auth);
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
          <PersonalInfo>{user.user_name}</PersonalInfo>
        </PersonalInfoWrapper>
      </PersonalInfoFlex>
      <PersonalInfoFlex>
        {user.is_active ? (
          <OnlineStatusWrapper>
            <PersonalTitle>Online</PersonalTitle>
            <HiOutlineStatusOnline />
          </OnlineStatusWrapper>
        ) : (
          <OnlineStatusWrapper>
            <PersonalTitle>Offline</PersonalTitle>
            <HiOutlineStatusOffline />
          </OnlineStatusWrapper>
        )}
        {/* <PersonalInfoWrapper>
          <PersonalTitle>Nick name</PersonalTitle>
          <PersonalInfo>{user.user_name}</PersonalInfo>
        </PersonalInfoWrapper> */}
      </PersonalInfoFlex>
    </ProfilePersonalInfoContainer>
  );
};

export default ProfilePersonalInfo;
