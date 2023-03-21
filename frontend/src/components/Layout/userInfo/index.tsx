import { Dropdown, MenuProps } from "antd";
import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
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

const UserInfo = () => {

  const { userInfo } = useAppSelector((state) => state.auth);

  const items: MenuProps["items"] = [
    {
      key: "2",
      label: <Link to="/settings">Settings</Link>,
      icon: <IoLogOut />,
    },
  ];
  console.log(userInfo);
  return (
    <ProfileWrapper>
      <Dropdown menu={{ items }} placement="bottomRight">
        <DropDownLink onClick={(e) => e.preventDefault()}>
          <ProfileImg src={UserProfilePicture} alt="A profile photo of the current user" />
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