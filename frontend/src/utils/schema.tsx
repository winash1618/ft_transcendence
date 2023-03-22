import * as yup from "yup";

export const PlaySchema = yup
  .object({
    map: yup
      .number()
      .required("Map field is required"),
  })
  .required();
