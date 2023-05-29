import * as yup from "yup";

export const PlaySchema = yup
  .object({
    hasMiddleWall: yup.boolean().required("Map field is required"),
  })
  .required();

export const NickNameSchema = yup
  .object({
    nickName: yup.string().matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{4,20}$/, "Nickname must be 4-8 characters and can only contain a mix of a-z, A-Z, 0-9, _ and -").required("Nick name field is required"),
  })
  .required();

export const TwoFactorSchema = yup
  .object({
    otp: yup.string().required("The pin field is required"),
  })
  .required();
