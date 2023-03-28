import { Button } from "antd";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserProfilePicture } from "../../assets";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchUserById } from "../../store/usersReducer";
import {
  ProfileBackground,
  ProfileButtonWrapper,
  ProfileContainer,
  ProfileHeader,
  ProfileInfoWrapper,
  ProfilePicture,
  ProfileWrapper,
  UserName,
  UserRating,
} from "./profilePage.styled";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.users);
  const { userInfo } = useAppSelector((state) => state.auth);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserById(id));
  }, []);

  return (
    <ProfileContainer>
      <ProfileHeader>
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
      </ProfileHeader>
    </ProfileContainer>
  );
};

export default ProfilePage;
