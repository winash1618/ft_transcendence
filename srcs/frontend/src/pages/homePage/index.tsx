import ButtonComponent from "../../components/ButtonComponent";
import axios, { BASE_URL } from "../../api";
import { HomeContainer, HomeDetails } from "./homepage.styled";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";
const HomePage = () => {
  const login = () => {
    window.location.replace(`${BASE_URL}/42/login`);
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`/token`);
        localStorage.setItem("auth", JSON.stringify(response.data));
        dispatch(setToken(response.data.token));
        dispatch(setUserInfo(response.data.user));
        navigate("/");
        return response.data.token;
      } catch (err) {
        dispatch(logOut());
      }
    };
    getToken();
  }, [dispatch, navigate]);
  return (
    <HomeContainer>
      <img
        src={
          "https://www.pngall.com/wp-content/uploads/2016/05/Ping-Pong-Download-PNG.png"
        }
        alt="Logo"
        style={{ width: "200px", height: "200px", padding: "20px" }}
      />
      <HomeDetails>
        <ButtonComponent
          style={{ width: "100%", marginBottom: "6px" }}
          onClick={login}
        >
          Login
        </ButtonComponent>
      </HomeDetails>
    </HomeContainer>
  );
};

export default HomePage;
