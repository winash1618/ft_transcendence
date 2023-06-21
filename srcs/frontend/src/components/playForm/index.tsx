import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Spin, List, Pagination, Typography } from "antd";
import { ErrorAlert } from "../toastify";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  FormContainer,
  FormDetails,
  FormInputTitle,
  FormSelect,
  FormTitle,
  InputAlert,
  InputController,
  SearchingWrapper,
  LeaderboardContainer,
  LeaderboardItem,
  LeaderboardRank,
  LeaderboardAvatar,
  LeaderboardName,
  LeaderboardScore,
} from "./playForm.styled";
import { PlaySchema } from "../../utils/schema";
import {
  UserProfilePicture,
} from "../../assets";
import ButtonComponent from "../ButtonComponent";
import { BASE_URL, axiosPrivate } from "../../api";

const { Title } = Typography;

interface LeaderboardData {
  rank: number;
  login: string;
  username: string;
  rating: number;
  profile_picture: string;
}

export type PlayType = {
  hasMiddleWall: boolean;
};

const PlayForm = () => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { socket } = useAppSelector((state) => state.game);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PlayType>({ resolver: yupResolver(PlaySchema) });

  const [data, setData] = useState<LeaderboardData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const getInfos = async () => {
    try {
      const response = await axiosPrivate.get("/users/leaderboard/leaders");
      if (response.status === 200) {
        setData(response.data);
      } else {
        window.location.href = "/error";
      }
    } catch (error) {
      window.location.href = "/error";
    }
  };

  useEffect(() => {
    getInfos();
  }, []);

  useEffect(() => {
    const handleException = (data) => {
      ErrorAlert("An unknown error has occurred", 5000);
      socket?.emit("leaveQueue");
      setIsSearching(false);
    };

    socket?.on("exception", handleException);
    return () => {
      socket?.off("exception", handleException);
      socket?.emit("leaveQueue");
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
	<div style={{ display: "flex", flexWrap: "wrap" }}>
    <div style={{ flex: "1 0 100%", marginBottom: "1rem" }}>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Find a game</FormTitle>
        <FormDetails>
          <InputController>
            <FormInputTitle htmlFor="hasMiddleWall">
              Choose a map
            </FormInputTitle>
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
            {errors.hasMiddleWall && (
              <InputAlert>{errors.hasMiddleWall.message}</InputAlert>
            )}
          </InputController>
          {isSearching ? (
            <>
              <ButtonComponent
                style={{ width: "100%", marginBottom: "6px", padding: 0 }}
                htmlType="submit"
              >
                Leave Queue
              </ButtonComponent>
              <SearchingWrapper>
                <p>Searching ...</p>
                <Spin />
              </SearchingWrapper>
            </>
          ) : (
            <ButtonComponent
              style={{ width: "100%", marginBottom: "6px", padding: 0 }}
              htmlType="submit"
            >
              Find game
            </ButtonComponent>
          )}
        </FormDetails>
      </FormContainer>
		</div>
			<div  style={{ flex: "1 0 100%", display: "flex", justifyContent: "center", alignItems: "center",  }}>

      <LeaderboardContainer>
        <Title style={{ color: "white", textAlign: "center" }}>
          Leaderboard
        </Title>
        <List
          itemLayout="horizontal"
          dataSource={data.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )}
          renderItem={(player, index) => (
            <LeaderboardItem key={player.rank}>
              <LeaderboardRank>{index + 1}</LeaderboardRank>
              <LeaderboardName>{player.login}</LeaderboardName>
              <LeaderboardScore className="leaderboard-score">
                {player.rating}
              </LeaderboardScore>
              <LeaderboardAvatar
                className="leaderboard-avatar"
                src={`${BASE_URL}/users/profile-image/${player.profile_picture}/${token}`}
                onError={(e) => {
                  e.currentTarget.src = UserProfilePicture;
                }}
              />
            </LeaderboardItem>
          )}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.length}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          }} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            marginTop: "1rem",
          }}
        />
      </LeaderboardContainer>
			</div>
    </div>
  );
};

export default PlayForm;
