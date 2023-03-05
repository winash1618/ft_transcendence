import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "../../components/loading";
import { useAppDispatch } from "../../hooks/reduxHooks";
import axios from "../../api";
import { setUserInfo } from "../../store/authReducer";

const AuthorizationPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const authorizeUser = async (code: string) => {
    try {
      const response = await axios.post(`/auth/authorize`, { code });
      localStorage.setItem("auth", JSON.stringify(response.data));
      dispatch(setUserInfo(response.data.user));
      navigate("/");
    } catch (err) {
      try {
        await axios.get(`/auth/logout`);
      } catch (err) {}
      navigate("/");
    }
  };

  useEffect(() => {
    const params = window.location.search;
    if (params) {
      const code = params.substring(6, params.length);
      authorizeUser(code);
    }
    navigate("/");
  }, []);
  return <Loading />;
};

export default AuthorizationPage;
