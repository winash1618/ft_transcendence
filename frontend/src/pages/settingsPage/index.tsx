import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlaySchema } from "../../utils/schema";
import { FormInput } from "../nickNamePage/nickNamePage.styled";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  FormContainer,
  FormDetails,
  FormInputTitle,
  FormTitle,
  InputAlert,
  InputController,
  SettingsContainer,
} from "./settingsPage.styled";
import ButtonComponent from "../../components/ButtonComponent";
import { useEffect, useState } from "react";
import { Modal, Popconfirm } from "antd";
import TwoFactorAuth from "../../components/twoFactorAuth";
import { axiosPrivate } from "../../api";
import { ErrorAlert, SuccessAlert } from "../../components/toastify";
import { setUserInfo } from "../../store/authReducer";
import { changeNickName, resetChangeNickName } from "../../store/usersReducer";
import { NickNameSchema } from "../../utils/schema";
import ProfilePicture from "../../components/profilePicture";

export type SettingsType = {
  nickName: string;
};

const SettingsPage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const { nickNameIsChanged } = useAppSelector((state) => state.users);
  const [showModal2FA, setShowModal2FA] = useState<boolean>(false);
  const [showModalProfile, setShowModalProfile] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SettingsType>({ resolver: yupResolver(NickNameSchema) });

  const onSubmit: SubmitHandler<SettingsType> = (data) => {
    if (data.nickName === userInfo.username) {
      ErrorAlert("Nickname is the same as the old one", 5000);
      return;
    }
    dispatch(changeNickName({ id: userInfo.id, name: data.nickName }));
  };
  const confirmDisable2FA = async () => {
    try {
      const response = await axiosPrivate.get("/disable-2fa");
      SuccessAlert("2-factor authentication disabled successfully", 5000);
      dispatch(setUserInfo(response.data.user));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (nickNameIsChanged) {
      SuccessAlert("Nickname changed successfully", 5000);
      dispatch(resetChangeNickName());
    }
  }, [nickNameIsChanged]);
  
  return (
    <SettingsContainer>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Settings</FormTitle>
        <FormDetails>
          <InputController>
            <FormInputTitle htmlFor="nickName">Change Nickname</FormInputTitle>
            <Controller
              control={control}
              defaultValue={userInfo.username}
              name="nickName"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  onChange={onChange}
                  value={value}
                  placeholder="Enter a new nickname"
                  id="nickName"
                />
              )}
            />
            {errors.nickName && (
              <InputAlert>{errors.nickName.message}</InputAlert>
            )}
          </InputController>
          <ButtonComponent
            style={{ width: "100%", marginBottom: "2rem", padding: 0 }}
            htmlType="submit"
          >
            Change nickname
          </ButtonComponent>
          {userInfo?.secret_code ? (
            <Popconfirm
              title="Disable 2FA?"
              description="Are you sure you want to disable 2FA?"
              onConfirm={confirmDisable2FA}
              okText="Yes"
              cancelText="No"
            >
              <ButtonComponent
                style={{ width: "100%", marginBottom: "2rem", padding: 0 }}
              >
                Disable 2-Factor Auth
              </ButtonComponent>
            </Popconfirm>
          ) : (
            <ButtonComponent
              style={{ width: "100%", marginBottom: "2rem", padding: 0 }}
              onClick={() => setShowModal2FA(true)}
            >
              Enable 2-Factor Auth
            </ButtonComponent>
          )}
          <ButtonComponent
            style={{ width: "100%", padding: 0 }}
            onClick={() => setShowModalProfile(true)}
          >
            Change profile picture
          </ButtonComponent>
        </FormDetails>
      </FormContainer>
      <Modal
        footer={null}
        open={showModal2FA}
        onCancel={() => setShowModal2FA(false)}
      >
        <TwoFactorAuth setShowModal={setShowModal2FA} />
      </Modal>
      <Modal
        footer={null}
        open={showModalProfile}
        onCancel={() => setShowModalProfile(false)}
      >
        <ProfilePicture setShowModal={setShowModalProfile} />
      </Modal>
    </SettingsContainer>
  );
};

export default SettingsPage;
