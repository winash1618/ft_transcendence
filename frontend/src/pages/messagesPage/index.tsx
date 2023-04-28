import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";
import axios, { BASE_URL } from "../../api";
import Chat from "../../components/chat";


const MessagesPage = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [user, setUser] = useState(null);
	const dispatch = useAppDispatch();
  
	useEffect(() => {
	  const getToken = async () => {
		try {
		  const response = await axios.get(`${BASE_URL}/token`, {
			withCredentials: true,
		  });
		  localStorage.setItem("auth", JSON.stringify(response.data));
		  dispatch(setUserInfo(response.data.user));
		  dispatch(setToken(response.data.token));
		  setUser(response.data.user);
		  return response.data.token;
		} catch (err) {
		  dispatch(logOut());
		  window.location.reload();
		  return null;
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
				user={user}
			/>
		</>
	);
};

export default MessagesPage;