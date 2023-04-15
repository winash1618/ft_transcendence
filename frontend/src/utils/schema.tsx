import * as yup from "yup";

export const PlaySchema = yup
  .object({
    map: yup
      .number()
      .required("Map field is required"),
    mobile: yup
      .boolean(),
  })
  .required();

  export const NickNameSchema = yup
  .object({
    nickName: yup
      .string()
      .required("Nick name field is required"),
  })
  .required();
