import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlaySchema } from "../../utils/schema";
import { FormInput } from "../nickNamePage/nickNamePage.styled";
import { useAppSelector } from "../../hooks/reduxHooks";
import { FormContainer, FormDetails, FormInputTitle, FormTitle, InputAlert, InputController } from "./settingsPage.styled";
import ButtonComponent from "../../components/ButtonComponent";

export type SettingsType = {
  nickname: string;
};

const SettingsPage = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SettingsType>({ resolver: yupResolver(PlaySchema) });

  const onSubmit: SubmitHandler<SettingsType> = (data) => {};

  return (
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
          {errors.nickname && <InputAlert>{errors.nickname.message}</InputAlert>}
        </InputController>
        <ButtonComponent
          style={{ width: "100%", marginBottom: "6px" }}
          htmlType="submit"
        >
          Change nickname
        </ButtonComponent>
      </FormDetails>
    </FormContainer>
  );
};

export default SettingsPage;
