import { useEffect, useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";
import axios from "../../api";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../store/authReducer";
import { io, Socket } from "socket.io-client";

const PingPongPage = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [player, setPlayer] = useState<number>(1);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomID, setRoomID] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get("/token", {
          withCredentials: true,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        dispatch(setUserInfo(response.data.user));
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
        <PingPong player={player} roomID={roomID} socket={socket} />
      ) : (
        <PlayForm
          setIsGameStarted={setIsGameStarted}
          setPlayer={setPlayer}
          setRoomID={setRoomID}
          socket={socket}
        />
      )}
    </>
  );
};

export default PingPongPage;
