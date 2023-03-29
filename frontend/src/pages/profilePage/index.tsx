import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchUserById } from "../../store/usersReducer";
import PageNotFound404 from "../errorPages/pageNotFound";
import ProfileHeader from "./profileHeader";
import ProfilePersonalInfo from "./profilePersonalInfo";
import ProfileMatchHistory from "./profileMatchHistory";
import { ProfileContainer, ProfileInfoContainer } from "./profilePage.styled";

const ProfilePage = () => {
  const { isLoading, error } = useAppSelector((state) => state.users);
  const { login } = useParams<{ login: string }>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserById(login));
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : error?.response?.status === 404 ? (
        <PageNotFound404 />
      ) : (
        <ProfileContainer>
          <ProfileHeader />
          <ProfileInfoContainer>
            <ProfilePersonalInfo />
			<ProfileMatchHistory />
          </ProfileInfoContainer>
        </ProfileContainer>
      )}
    </>
  );
};

export default ProfilePage;
