import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormContainer,
  FormDetails,
  FormInput,
  FormInputTitle,
  FormTitle,
  InputAlert,
  InputController,
} from "./authenticatePage.styled";
import { NickNameSchema, TwoFactorSchema } from "../../utils/schema";
import ButtonComponent from "../../components/ButtonComponent";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { changeNickName } from "../../store/usersReducer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api";

export type AuthenticatorType = {
  otp: string;
};

const AuthenticatePage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<AuthenticatorType>({ resolver: yupResolver(TwoFactorSchema) });

  const { userInfo } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userInfo.is_authenticated) {
      navigate("/");
    }
  }, [userInfo]);

  const onSubmit: SubmitHandler<AuthenticatorType> = async (data) => {
    try {
      await axiosPrivate.post("/validate-otp", {
        otp: data.otp,
      });
      navigate("/");
    } catch (err) {
      setError("Invalid pin, please try again");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>Authenticator</FormTitle>
      <FormDetails>
        <InputController>
          <FormInputTitle htmlFor="otp">Enter pin</FormInputTitle>
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, value } }) => (
              <FormInput
                onChange={(value) => {
                  onChange(value);
                  setError(null);
                }}
                value={value}
                placeholder="Please enter the pin from your authenticator app"
                id="otp"
              />
            )}
          />
          {errors.otp && <InputAlert>{errors.otp.message}</InputAlert>}
          {error && <InputAlert>{error}</InputAlert>}
        </InputController>
        <ButtonComponent
          style={{ width: "100%", marginBottom: "6px" }}
          htmlType="submit"
        >
          Verify
        </ButtonComponent>
      </FormDetails>
    </FormContainer>
  );
};

export default AuthenticatePage;
