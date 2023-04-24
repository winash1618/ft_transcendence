import { useEffect, useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";
import axios from "../../api";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";
import { io, Socket } from "socket.io-client";

const PingPongPage = () => {
  const { isGameStarted } = useAppSelector((state) => state.game);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mobile, setMobile] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get("/token", {
          withCredentials: true,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        dispatch(setUserInfo(response.data.user));
        dispatch(setToken(response.data.token));
        return response.data.token;
      } catch (err) {
        dispatch(logOut());
        window.location.reload();
        return null;
      }
    };
    const getSocket = async () => {
      const socket = io(process.env.REACT_APP_SOCKET_URL, {
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
  }, [dispatch]);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);
  return (
    <>
      {isGameStarted ? (
        <PingPong
          mobile={mobile}
          socket={socket}
        />
      ) : (
        <PlayForm
          setMobile={setMobile}
          socket={socket}
        />
      )}
    </>
  );
};

export default PingPongPage;
