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
} from "./nickNamePage.styled";
import { NickNameSchema } from "../../utils/schema";
import ButtonComponent from "../../components/ButtonComponent";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setUserInfo } from "../../store/authReducer";
import { axiosPrivate } from "../../api";
import { ErrorAlert } from "../../components/toastify";

export type NickNameType = {
  nickName: string;
};

const NickNamePage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<NickNameType>({ resolver: yupResolver(NickNameSchema) });

  const { userInfo } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!userInfo.username) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const onSubmit: SubmitHandler<NickNameType> = async (data) => {
    try {
      const result = await axiosPrivate.patch(`/users/${userInfo.id}`, {
        name: data.nickName,
      });
      dispatch(setUserInfo(result.data.name));
      navigate("/");
    }
    catch (err) {
      ErrorAlert(err.response.data.message, 5000);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>Choose a nick name</FormTitle>
      <FormDetails>
        <InputController>
          <FormInputTitle htmlFor="nickName">Nick name</FormInputTitle>
          <Controller
            control={control}
            name="nickName"
            render={({ field: { onChange, value } }) => (
              <FormInput
                onChange={onChange}
                value={value}
                placeholder="Type a nick name that you want to play with"
                id="nickName"
              />
            )}
          />
          {errors.nickName && (
            <InputAlert>{errors.nickName.message}</InputAlert>
          )}
        </InputController>
        <ButtonComponent
          style={{ width: "100%", marginBottom: "6px" }}
          htmlType="submit"
        >
          Set nickname
        </ButtonComponent>
      </FormDetails>
    </FormContainer>
  );
};

export default NickNamePage;
