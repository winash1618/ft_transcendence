import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { UserProfilePicture } from "../../../assets";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { draw } from "./pingPongCanvas.functions";
import {
	GameProfileImg,
	ScoreText,
	ScoreUserInfoWrapper,
	ScoreWrapper,
	StatusText,
	StyledCanvas,
} from "./pingPongCanvas.styled";
import { PingPongContainer } from "../pingPong.styled";
import { BASE_URL } from "../../../api";

export let CANVAS_WIDTH = (window.innerHeight < 0.9 * window.innerWidth) ? window.innerHeight : 0.9 * window.innerWidth;
export let CANVAS_HEIGHT = 0.8 * CANVAS_WIDTH;

export type GameType = {
	pause: boolean;
	ball: {
		x: number;
		y: number;
		radius: number;
		borderColor: string;
		color: string;
	};
	paddle1: {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
	};
	paddle2: {
		x: number;
		y: number;
		width: number;
		height: number;
		color: string;
	};
};

let game: GameType = {
	pause: false,
	ball: {
		x: CANVAS_WIDTH / 2,
		y: CANVAS_HEIGHT / 2,
		radius: 0.015 * CANVAS_WIDTH,
		borderColor: "BLACK",
		color: "WHITE",
	},
	paddle1: {
		x: 0,
		y: 0.875 * CANVAS_HEIGHT / 2,
		width: 0.025 * CANVAS_WIDTH,
		height: 0.125 * CANVAS_HEIGHT,
		color: "WHITE",
	},
	paddle2: {
		x: 0.975 * CANVAS_WIDTH,
		y: 0.875 * CANVAS_HEIGHT / 2,
		width: 0.025 * CANVAS_WIDTH,
		height: 0.125 * CANVAS_HEIGHT,
		color: "WHITE",
	},
};

const PingPongCanvas = ({
  mobile,
}: {
  mobile: boolean;
}) => {
  const canvaRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useAppSelector((state) => state.game);
  const { players, player, roomID } = useAppSelector((state) => state.game);
  const { token } = useAppSelector((state) => state.auth);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(900);
  const [canvasHeight, setCanvasHeight] = useState<number>(800);
  const dispatch = useAppDispatch();

	useEffect(() => {
		if (gameStatus !== 0) {
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		}
	}, [gameStatus]);

	useEffect(() => {
		function handleResize() {
			canvaRef.current.width = (window.innerHeight < 0.9 * window.innerWidth) ? window.innerHeight : 0.9 * window.innerWidth;
			canvaRef.current.height = 0.8 * ((window.innerHeight < 0.9 * window.innerWidth) ? window.innerHeight : 0.9 * window.innerWidth);
			setCanvasWidth((window.innerHeight < 0.9 * window.innerWidth) ? window.innerHeight : 0.9 * window.innerWidth);
			setCanvasHeight(0.8 * ((window.innerHeight < 0.9 * window.innerWidth) ? window.innerHeight : 0.9 * window.innerWidth));
			game.paddle2.x = 0.975 * canvaRef.current.width;
			game.paddle2.width = 0.025 * canvaRef.current.width;
			game.paddle2.height = 0.125 * canvaRef.current.height;
			game.paddle1.x = 0;
			game.paddle1.width = 0.025 * canvaRef.current.width;
			game.paddle1.height = 0.125 * canvaRef.current.height;
			game.ball.radius = 0.015 * canvaRef.current.width;
		}
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [window]);

  return (
    <PingPongContainer>
      <StyledCanvas
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
        ref={canvaRef}
      />
      <ScoreWrapper>
        <ScoreUserInfoWrapper style={{ marginRight: "30px" }}>
          <GameProfileImg
            src={`${BASE_URL}/users/profile-image/${players.player1.profile_picture}/${token}`}
            onError={(e) => {
              e.currentTarget.src = UserProfilePicture;
            }}
            alt="A profile photo of the current user"
          />
          {players.player1.login}
        </ScoreUserInfoWrapper>
        <ScoreText>
          {player1Score} : {player2Score}{" "}
        </ScoreText>
        <ScoreUserInfoWrapper style={{ marginLeft: "30px" }}>
          {players.player2.login}
          <GameProfileImg
            src={`${BASE_URL}/users/profile-image/${players.player2.profile_picture}/${token}`}
            onError={(e) => {
              e.currentTarget.src = UserProfilePicture;
            }}
            alt="A profile photo of the current user"
          />
        </ScoreUserInfoWrapper>
      </ScoreWrapper>
      <AnimatePresence>
        {gameStatus === 1 && (
          <StatusText initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            You win
          </StatusText>
        )}
        {gameStatus === 2 && (
          <StatusText initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            You lose
          </StatusText>
        )}
      </AnimatePresence>
    </PingPongContainer>
  );
};

export default PingPongCanvas;
