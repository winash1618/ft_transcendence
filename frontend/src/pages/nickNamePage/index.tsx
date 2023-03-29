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

export type NickNameType = {
  nickName: number;
};

const NickNamePage = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<NickNameType>({ resolver: yupResolver(NickNameSchema) });

  const onSubmit: SubmitHandler<NickNameType> = (data) => {
	console.log(data);
  };
  console.log(errors);
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
