import * as yup from "yup";

export const PlaySchema = yup
  .object({
    hasMiddleWall: yup.boolean().required("Map field is required"),
  })
  .required();

export const NickNameSchema = yup
  .object({
    nickName: yup.string().matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{4,20}$/, "Nick name must be 3 or more characters and 20 or less characters long and can only contain these characters a-z A-Z 0-9 _ and -").required("Nick name field is required"),
  })
  .required();

export const TwoFactorSchema = yup
  .object({
    otp: yup.string().required("The pin field is required"),
  })
  .required();
