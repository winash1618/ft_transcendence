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
import { useState } from "react";
import { Modal, Popconfirm } from "antd";
import TwoFactorAuth from "../../components/twoFactorAuth";
import { axiosPrivate } from "../../api";
import { SuccessAlert } from "../../components/toastify";
import { setUserInfo } from "../../store/authReducer";

export type SettingsType = {
  nickname: string;
};

const SettingsPage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const [showModal, setShowModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SettingsType>({ resolver: yupResolver(PlaySchema) });

  const onSubmit: SubmitHandler<SettingsType> = (data) => {};
  const confirmDisable2FA = async () => {
    try {
      const response = await axiosPrivate.get("/disable-2fa");
      SuccessAlert("2-factor authentication disabled successfully", 5000);
      dispatch(setUserInfo(response.data.user));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SettingsContainer>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Settings</FormTitle>
        <FormDetails>
          <InputController>
            <FormInputTitle htmlFor="nickname">Change Nickname</FormInputTitle>
            <Controller
              control={control}
              defaultValue={userInfo.username}
              name="nickname"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  onChange={onChange}
                  value={value}
                  placeholder="Enter a new nickname"
                  id="nickname"
                />
              )}
            />
            {errors.nickname && (
              <InputAlert>{errors.nickname.message}</InputAlert>
            )}
          </InputController>
          <ButtonComponent
            style={{ width: "100%", marginBottom: "2rem" }}
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
              <ButtonComponent style={{ width: "100%" }}>
                Disable 2-factor authentication
              </ButtonComponent>
            </Popconfirm>
          ) : (
            <ButtonComponent
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Enable 2-factor authentication
            </ButtonComponent>
          )}
        </FormDetails>
      </FormContainer>
      <Modal
        footer={null}
        open={showModal}
        onCancel={() => setShowModal(false)}
      >
        <TwoFactorAuth setShowModal={setShowModal} />
      </Modal>
    </SettingsContainer>
  );
};

export default SettingsPage;
