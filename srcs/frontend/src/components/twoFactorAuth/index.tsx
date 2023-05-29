import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { axiosPrivate } from "../../api";
import Loading from "../loading";
import {
  FormContainer,
  FormInputTitle,
  FormTitle,
  InputAlert,
  InputController,
} from "../../pages/settingsPage/settingsPage.styled";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  FormDetails,
  FormInput,
} from "../../pages/nickNamePage/nickNamePage.styled";
import ButtonComponent from "../ButtonComponent";
import { yupResolver } from "@hookform/resolvers/yup";
import { TwoFactorSchema } from "../../utils/schema";
import { SuccessAlert } from "../toastify";
import { setUserInfo } from "../../store/authReducer";

export type TwoFactorType = {
  otp: string;
};

const TwoFactorAuth = ({ setShowModal }: { setShowModal: any }) => {
  const [secretKey, setSecretCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [qrCode, setQrCode] = useState<string>("");
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TwoFactorType>({ resolver: yupResolver(TwoFactorSchema) });

  const onSubmit: SubmitHandler<TwoFactorType> = async (data) => {
    setError(null);
    try {
      const response = await axiosPrivate.post("/verify-otp", {
        otp: data.otp,
        secret: secretKey,
      });
      SuccessAlert("2-factor authentication enabled successfully", 5000);
      setShowModal(false);
      dispatch(setUserInfo(response.data.user));
    } catch (err) {
      setError("Invalid pin, please try again");
    }
  };
  useEffect(() => {
    const getSecretCode = async () => {
      try {
        const response = await axiosPrivate.get("/generate");
        setSecretCode(response.data.secret);
        setQrCode(response.data.qrCode);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    getSecretCode();
  }, []);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <FormContainer
          style={{ padding: "1rem" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormTitle>Enable 2-factor authentication</FormTitle>
          <FormDetails
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "100%",
            }}
          >
            <p>
              1. Download an authenticator app: There are many authenticator
              apps to choose from, including Google Authenticator, Microsoft
              Authenticator, Authy, and others. Download and install the app on
              your smartphone from your device's app store.
            </p>
            <br />
            <p>
              2. Scan the QR code: Open the authenticator app on your smartphone
              and scan the QR code below. If you can't scan the QR code, you can
              manually enter the secret key below.
            </p>
            <img src={qrCode} alt="qrcode to scan" />
            <p>Secret key: {secretKey}</p>
            <InputController style={{ paddingTop: "20px" }}>
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
                    placeholder="
                    Enter pin from authenticator app"
                    id="otp"
                  />
                )}
              />
              {errors.otp && (
                <InputAlert style={{ color: "red" }}>
                  {errors.otp.message}
                </InputAlert>
              )}
              {error && (
                <InputAlert style={{ color: "red" }}>{error}</InputAlert>
              )}
            </InputController>
            <ButtonComponent style={{ width: "100%" }} htmlType="submit">
              Enable
            </ButtonComponent>
          </FormDetails>
        </FormContainer>
      )}
    </>
  );
};

export default TwoFactorAuth;
