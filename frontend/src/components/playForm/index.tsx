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
import { Spin } from "antd";
import { ErrorAlert } from "../toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setGameInfo } from "../../store/gameReducer";

export type PlayType = {
  hasMiddleWall: boolean;
};

const PlayForm = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { socket } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PlayType>({ resolver: yupResolver(PlaySchema) });

  useEffect(() => {
    socket?.on("error", (data) => {
      ErrorAlert("You are already in the queue", 5000);
    });
    return () => {
      socket?.off("error", (data) => {
        ErrorAlert("You are already in the queue", 5000);
      });
    };
  }, [socket, dispatch]);

  const onSubmit: SubmitHandler<PlayType> = (data) => {
    if (!isSearching) {

      setIsSearching(true);
      socket?.emit("Register", data);
    } else {
      setIsSearching(false);
      socket?.emit("leaveQueue");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>Find a game</FormTitle>
      <FormDetails>
        <InputController>
          <FormInputTitle htmlFor="hasMiddleWall">Choose a map</FormInputTitle>
          <Controller
            control={control}
            defaultValue={false}
            name="hasMiddleWall"
            render={({ field: { onChange, value } }) => (
              <FormSelect
                onChange={onChange}
                options={[
                  { value: false, label: "Default" },
                  { value: true, label: "Wall map" },
                ]}
                value={value}
                placeholder="Choose a map to play with"
                id="hasMiddleWall"
              />
            )}
          />
          {errors.hasMiddleWall && <InputAlert>{errors.hasMiddleWall.message}</InputAlert>}
        </InputController>
        {isSearching ?
        <>
        <ButtonComponent
          style={{ width: "100%", marginBottom: "6px" }}
          htmlType="submit"
        >
          Leave Queue
        </ButtonComponent>
          <SearchingWrapper>
            <p>Searching ...</p>
            <Spin />
          </SearchingWrapper>
          </>
          : <ButtonComponent
          style={{ width: "100%", marginBottom: "6px" }}
          htmlType="submit"
        >
          Find game
        </ButtonComponent>
        }
      </FormDetails>
    </FormContainer>
  );
};

export default PlayForm;
