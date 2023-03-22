import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ButtonComponent from "../ButtonComponent";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormContainer,
  FormDetails,
  FormInputTitle,
  FormSelect,
  FormTitle,
  InputAlert,
  InputController,
} from "./playForm.styled";
import { PlaySchema } from "../../utils/schema";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { logOut, setUserInfo } from "../../store/authReducer";
import axios from "../../api";
import { useAppDispatch } from "../../hooks/reduxHooks";

export type PlayType = {
  map: number;
  password: string;
  rememberMe: boolean;
};

const PlayForm = ({ setIsGameStarted }: { setIsGameStarted: any }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PlayType>({ resolver: yupResolver(PlaySchema) });

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

  useEffect(() => {
    getSocket();
  }, []);

  useEffect(() => {
    socket?.on("start", (data) => {
      setIsGameStarted(true);
    });
    return () => {
      socket?.off("start", (data) => {});
      socket?.disconnect();
    };
  }, [socket]);

  const onSubmit: SubmitHandler<PlayType> = (data) => {
	socket?.emit("queue", data)
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>Find a game</FormTitle>
      <FormDetails>
        <InputController>
          <FormInputTitle htmlFor="map">Choose a map</FormInputTitle>
          <Controller
            control={control}
            name="map"
            render={({ field: { onChange, value } }) => (
              <FormSelect
                onChange={onChange}
                options={[
                  { value: 1, label: "Rocky blue" },
                  { value: 2, label: "Icy lakes" },
                  { value: 3, label: "Red sands" },
                ]}
                value={value}
                placeholder="Choose a map to play with"
                id="map"
              />
            )}
          />
          {errors.map && <InputAlert>{errors.map.message}</InputAlert>}
        </InputController>
        <ButtonComponent
          style={{ width: "100%", marginTop: 10 }}
          htmlType="submit"
        >
          Find game
        </ButtonComponent>
      </FormDetails>
    </FormContainer>
  );
};

export default PlayForm;
