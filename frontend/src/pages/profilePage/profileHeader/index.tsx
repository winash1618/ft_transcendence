import { Button } from "antd";
import { UserProfilePicture } from "../../../assets";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
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
import { BASE_URL, axiosPrivate } from "../../../api";
import { setUserInfo } from "../../../store/authReducer";

const ProfileHeader = () => {
  const { user } = useAppSelector((state) => state.users);
  const { userInfo, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const addFriend = async () => {
    try {
      const response = await axiosPrivate.post("/users/create-invite", {
        type: "FRIEND",
        receiverId: user?.id,
      });
      dispatch(setUserInfo(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const removeFriend = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/users/${userInfo?.id}/unfriend/${user?.id}`
      );
      dispatch(setUserInfo(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const block = async () => {
    try {
      const response = await axiosPrivate.post(
        `/users/${userInfo?.id}/block/${user?.id}`
      );
      console.log(response);
      dispatch(setUserInfo(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const unBlock = async () => {
    try {
      const response = await axiosPrivate.delete(
        `/users/${userInfo?.id}/unblock/${user?.id}`
      );
      console.log(response);
      dispatch(setUserInfo(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ProfileHeaderContainer>
      <ProfileBackground
        style={{
          backgroundImage:
            "url('https://wallpapers.com/images/hd/fractal-blue-abstract-beautiful-dark-background-uvu5h88yk9m8ugzv.jpg')",
        }}
      />
      <ProfileWrapper>
        <ProfilePicture
          src={`${BASE_URL}/users/profile-image/${user?.profile_picture}/${token}`}
          onError={(e) => {
            e.currentTarget.src = UserProfilePicture;
          }}
          alt="A profile photo of the current user"
        />
        <ProfileInfoWrapper>
          <UserName>{user.first_name + " " + user.last_name}</UserName>
          <UserRating type="secondary">{`Score: ${user.rating}`}</UserRating>
        </ProfileInfoWrapper>
      </ProfileWrapper>
      {userInfo.login !== user.login && (
        <ProfileButtonWrapper>
          {userInfo.blocked_users?.some(
            (userItem) => userItem.login === user.login
          ) ? null : userInfo.friends?.some(
              (userItem) => userItem.login === user.login
            ) ? (
            <Button onClick={removeFriend} type="primary" danger>
              Remove friend
            </Button>
          ) : userInfo.sentInvites?.some(
              (item) => item.receiverId === user.id
            ) ? (
            <Button
              type="primary"
              style={{
                background: "green",
                pointerEvents: "none",
                color: "white",
              }}
            >
              Request sent
            </Button>
          ) : (
            <Button onClick={addFriend} type="primary">
              Add friend
            </Button>
          )}
          {userInfo.blocked_users?.some(
            (userItem) => userItem.login === user.login
          ) ? (
            <Button onClick={unBlock} type="primary">
              Unblock
            </Button>
          ) : (
            <Button onClick={block} type="primary" danger>
              Block
            </Button>
          )}
        </ProfileButtonWrapper>
      )}
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
