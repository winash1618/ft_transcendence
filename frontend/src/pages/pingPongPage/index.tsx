import { useEffect, useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";
import axios from "../../api";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";
import { io, Socket } from "socket.io-client";

const PingPongPage = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [player, setPlayer] = useState<number>(1);
  const [players, setPlayers] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [mobile, setMobile] = useState<boolean>(false);
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
          player={player}
          roomID={roomID}
          socket={socket}
          players={players}
        />
      ) : (
        <PlayForm
          setIsGameStarted={setIsGameStarted}
          setPlayer={setPlayer}
          setPlayers={setPlayers}
          setMobile={setMobile}
          setRoomID={setRoomID}
          socket={socket}
        />
      )}
    </>
  );
};

export default PingPongPage;
