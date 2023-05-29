

import { toast } from "react-toastify";

export const SuccessAlert = (
  message: string,
  autoClose: number | false | undefined
) => {
  return toast.success(message, {
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const ErrorAlert = (
  message: string,
  autoClose: number | false | undefined
) => {
  return toast.error(message, {
    position: "top-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};