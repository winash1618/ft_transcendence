import { useAppSelector } from "../../../hooks/reduxHooks";
import { ProfilePersonalInfoContainer } from "./profilePersonalInfo.styled";

const ProfilePersonalInfo = () => {
  const { user } = useAppSelector((state) => state.users);
  const { userInfo } = useAppSelector((state) => state.auth);
  console.log(user);
  return (
    <ProfilePersonalInfoContainer>
      <h1>First name</h1>
	  <p>{user.first_name}</p>
    </ProfilePersonalInfoContainer>
  );
};

export default ProfilePersonalInfo;
