import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchMatchHistory, fetchUserById } from "../../store/usersReducer";
import PageNotFound404 from "../errorPages/pageNotFound";
import ProfileHeader from "./profileHeader";
import ProfilePersonalInfo from "./profilePersonalInfo";
import ProfileMatchHistory from "./profileMatchHistory";
import {
  CustomCol,
  ProfileCenterContainer,
  ProfileContainer,
  ProfileInfoContainer,
} from "./profilePage.styled";
import { Col } from "antd";

const ProfilePage = () => {
  const { isLoading, error } = useAppSelector((state) => state.users);
  const { login } = useParams<{ login: string }>();
  const { userInfo } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserById(login));
    dispatch(fetchMatchHistory(userInfo?.id));
    console.log(userInfo?.id);
  }, [dispatch, location]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : error?.response?.status === 404 ? (
        <PageNotFound404 />
      ) : (
        <ProfileContainer>
          <ProfileHeader />
          <ProfileCenterContainer>
            <ProfileInfoContainer gutter={[64, 64]}>
              <CustomCol xs={24} lg={12}>
                <ProfilePersonalInfo />
              </CustomCol>
              <CustomCol xs={24} lg={12}>
                <ProfileMatchHistory />
              </CustomCol>
            </ProfileInfoContainer>
          </ProfileCenterContainer>
        </ProfileContainer>
      )}
    </>
  );
};

export default ProfilePage;
