import { Dropdown, MenuProps } from "antd";
import { IoLogOut } from "react-icons/io5";
import { Link } from "react-router-dom";
import { UserProfilePicture } from "../../../assets";
import { useAppSelector } from "../../../hooks/reduxHooks";
import {
  ChevronIcon,
  DropDownLink,
  ProfileImg,
  ProfileWrapper,
  UserInfoWrapper,
  UserLogin,
  UserName,
} from "./userInfo.styled";
import useLogout from "../../../hooks/useLogout";

const UserInfo = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const logOut = useLogout();
  const signOut = async () => {
    await logOut();
    window.location.reload();
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to="/settings">Settings</Link>,
      icon: <IoLogOut />,
    },
    {
      key: "2",
      label: <Link to={`/profile/${userInfo.login}`}>Profile</Link>,
      icon: <IoLogOut />,
    },
    {
      key: "3",
      label: <span onClick={signOut}>Logout</span>,
      icon: <IoLogOut />,
    },
  ];
  return (
    <ProfileWrapper>
      <Dropdown menu={{ items }} placement="bottomRight">
        <DropDownLink onClick={(e) => e.preventDefault()}>
          <ProfileImg
            src={`http://localhost:3001/users/profile-image/${userInfo?.profile_picture}`}
            onError={(e) => {
              e.currentTarget.src = UserProfilePicture;
            }}
            alt="A profile photo of the current user"
          />
          <UserInfoWrapper>
            <UserName>{userInfo?.first_name}</UserName>
            <UserLogin type="secondary">{userInfo?.login}</UserLogin>
          </UserInfoWrapper>
          <ChevronIcon />
        </DropDownLink>
      </Dropdown>
    </ProfileWrapper>
  );
};

export default UserInfo;
