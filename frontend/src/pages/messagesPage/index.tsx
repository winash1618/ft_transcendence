import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import Chat from "../../components/chat";
import axios, { BASE_URL } from "../../api";
import { logOut, setToken, setUserInfo } from "../../store/authReducer";
const timeInMinutes = process.env.REACT_APP_JWT_EXPIRES_IN as string;
const timeInMinutesNumber = parseInt(timeInMinutes.replace('m', '')) * 60;
const MessagesPage = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [user, setUser] = useState(null);
	const dispatch = useAppDispatch();
	const [connectionTime, setConnectionTime] = useState(null);
	const { userInfo } = useAppSelector((state) => state.auth);

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
		const time = new Date();
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
		setConnectionTime(time);
	};

	useEffect(() => {
		getSocket();
		setUser(userInfo);
	}, [dispatch]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const currentTime = new Date();
			const timeDifference = (currentTime.getTime() - connectionTime) / 1000;
			// console.log("timeDifference", timeDifference);
			const tokenExpiryTime = timeInMinutesNumber;
			const timeBeforeExpiry = tokenExpiryTime - timeDifference;
			if (timeBeforeExpiry <= 10 && socket) {
				socket.disconnect();
				getSocket();
			}
		}, 500);
		return () => {
			clearInterval(intervalId);
		};
	}, [connectionTime, socket]);

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