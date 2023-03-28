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
  SearchingWrapper,
} from "./playForm.styled";
import { PlaySchema } from "../../utils/schema";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Spin } from "antd";
import { ErrorAlert } from "../toastify";

export type PlayType = {
  map: number;
  password: string;
  rememberMe: boolean;
};

const PlayForm = ({
  setIsGameStarted,
  setPlayer,
  socket,
  setRoomID,
}: {
  setIsGameStarted: any;
  setPlayer: any;
  socket: Socket | null;
  setRoomID: any;
}) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PlayType>({ resolver: yupResolver(PlaySchema) });

  useEffect(() => {
    socket?.on("start", (data) => {
      setIsGameStarted(true);
      setPlayer(data.playerNo);
      setRoomID(data.roomID);
    });
    socket?.on("error", (data) => {
      ErrorAlert("You are already in the queue", 5000);
    });
    return () => {
      socket?.off("start", (data) => {
        setIsGameStarted(true);
        setPlayer(data.playerNo);
        setRoomID(data.roomID);
      });
      socket?.off("error", (data) => {
        ErrorAlert("You are already in the queue", 5000);
      });
    };
  }, [socket, setIsGameStarted, setPlayer, setRoomID]);

  const onSubmit: SubmitHandler<PlayType> = (data) => {
    setIsSearching(true);
    socket?.emit("Register", data);
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
          style={{ width: "100%", marginBottom: "6px" }}
          htmlType="submit"
        >
          Find game
        </ButtonComponent>
        {isSearching && (
          <SearchingWrapper>
            <p>Searching ...</p>
            <Spin />
          </SearchingWrapper>
        )}
      </FormDetails>
    </FormContainer>
  );
};

export default PlayForm;
