import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setUserInfo } from "../../store/authReducer";
import axios from "../../api";
import Chat from "../../chat";


const MessagesPage = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
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
			<Chat
				socket={socket}
				
			/>
		</>
	);
};

export default MessagesPage;