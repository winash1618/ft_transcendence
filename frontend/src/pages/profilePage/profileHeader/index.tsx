import { Button } from "antd";
import { UserProfilePicture } from "../../../assets";
import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  ProfileBackground,
  ProfileButtonWrapper,
  ProfileHeaderContainer,
  ProfileInfoWrapper,
  ProfilePicture,
  ProfileWrapper,
  UserName,
  UserRating,
} from "./profileHeader.styled";

const ProfileHeader = () => {
  const { user } = useAppSelector((state) => state.users);
  const { userInfo } = useAppSelector((state) => state.auth);
  return (
    <ProfileHeaderContainer>
      <ProfileBackground
        style={{
          backgroundImage:
            "url('https://wallpapers.com/images/hd/fractal-blue-abstract-beautiful-dark-background-uvu5h88yk9m8ugzv.jpg')",
        }}
      />
      <ProfileWrapper>
        <ProfilePicture src={UserProfilePicture}></ProfilePicture>
        <ProfileInfoWrapper>
          <UserName>{user.first_name + " " + user.last_name}</UserName>
          <UserRating type="secondary">{"Rating 1000"}</UserRating>
        </ProfileInfoWrapper>
      </ProfileWrapper>
      {userInfo.login !== user.login && (
        <ProfileButtonWrapper>
          <Button type="primary">Add friend</Button>
          <Button type="primary" danger>
            Block
          </Button>
        </ProfileButtonWrapper>
      )}
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
