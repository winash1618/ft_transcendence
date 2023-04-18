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
import { axiosPrivate } from "../../../api";
import { setUserInfo } from "../../../store/authReducer";

const ProfileHeader = () => {
  const { user } = useAppSelector((state) => state.users);
  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const addFriend = async () => {
    try {
      const response = await axiosPrivate.post("/users/add-friend", {
        username: user.username,
        friend_id: user.id,
        login: user.login,
        user_id: userInfo.id,
      });
      console.log(response);
      dispatch(setUserInfo(response.data));
    } catch (err) {
      console.log("test");
      console.log(err);
    }
  };

  const removeFriend = async () => {
    try {
      const response = await axiosPrivate.delete(`/users/remove-friend/${user.login}`);
      console.log(response);
      dispatch(setUserInfo(response.data));
    } catch (err) {
      console.log("test");
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
          src={`http://localhost:3001/users/profile-image/${user?.profile_picture}`}
          onError={(e) => {
            e.currentTarget.src = UserProfilePicture;
          }}
          alt="A profile photo of the current user"
        />
        <ProfileInfoWrapper>
          <UserName>{user.first_name + " " + user.last_name}</UserName>
          <UserRating type="secondary">{"Rating 1000"}</UserRating>
        </ProfileInfoWrapper>
      </ProfileWrapper>
      {userInfo.login !== user.login && (
        <ProfileButtonWrapper>
          {userInfo.new_friends?.some(
            (userItem) => userItem.login === user.login
          ) ? (
            <Button onClick={removeFriend} type="primary" danger>
              Remove friend
            </Button>
          ) : (
            <Button onClick={addFriend} type="primary">
              Add friend
            </Button>
          )}
          <Button type="primary" danger>
            Block
          </Button>
        </ProfileButtonWrapper>
      )}
    </ProfileHeaderContainer>
  );
};

export default ProfileHeader;
