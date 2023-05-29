import { useDispatch } from "react-redux";
import { logOut } from "../store/authReducer";
import localStorage from "redux-persist/es/storage";
import { axiosPrivate } from "../api";

const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    dispatch(logOut());
    try {
      await axiosPrivate.get("/logout");
      localStorage.removeItem("auth");
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;