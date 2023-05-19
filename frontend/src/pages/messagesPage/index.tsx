import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import Chat from "../../components/chat";
import axios, { BASE_URL } from "../../api";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";

const MessagesPage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState(null);
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get(`/token`);
        localStorage.setItem("auth", JSON.stringify(response.data));
        dispatch(setToken(response.data.token));
        dispatch(setUserInfo(response.data.user));
        return response.data.token;
      } catch (err) {
        dispatch(logOut());
        window.location.replace(`${BASE_URL}/42/login`);
      }
    };
    const getSocket = async () => {
      const socket = io(process.env.REACT_APP_CHAT_GATEWAY, {
        withCredentials: true,
        auth: async (cb) => {
          const token = await getToken();
          cb({
            token,
          });
        },
      });
      setSocket(socket);
    };
    getSocket();
    setUser(userInfo);
  }, [dispatch, userInfo]);

  return (
    <>
      <Chat socket={socket} user={user} />
    </>
  );
};

export default MessagesPage;
