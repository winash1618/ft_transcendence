import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { UserProfilePicture } from "../../../assets";
import { useAppDispatch } from "../../../hooks/reduxHooks";
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
	player,
	players,
	roomID,
	socket,
	mobile,
}: {
	player: number;
	players: any;
	mobile: boolean;
	roomID: string;
	socket: Socket | null;
}) => {
	const canvaRef = useRef<HTMLCanvasElement>(null);
	const [gameStatus, setGameStatus] = useState<number>(0);
	const [player1Score, setPlayer1Score] = useState<number>(0);
	const [player2Score, setPlayer2Score] = useState<number>(0);
	const [canvasWidth, setCanvasWidth] = useState<number>(CANVAS_WIDTH);
	const [canvasHeight, setCanvasHeight] = useState<number>(CANVAS_HEIGHT);
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

	useEffect(() => {
		if (canvaRef.current) {
			if (mobile) {
				canvaRef.current.width = 300;
				canvaRef.current.height = 500;
				game.paddle1.width = 10;
				game.paddle1.height = 50;
				game.paddle2.width = 10;
				game.paddle2.height = 50;
				game.paddle2.x = 300 - 10;
				game.paddle1.x = 0;
				game.paddle2.y = 500 / 2 - 50 / 2;
				game.paddle1.y = 500 / 2 - 50 / 2;
				game.ball.radius = 6.25;
			} else {
				canvaRef.current.width = canvasWidth;
				canvaRef.current.height = canvasHeight;
			}
			let ctx = canvaRef.current.getContext("2d");
			if (ctx) {
				requestAnimationFrame(() =>
					draw(ctx, game, player, setPlayer1Score, setPlayer2Score)
				);
			}
		}
		if (mobile) {
			window.addEventListener("mousemove", (event) => {
				socket?.emit("moveMouse", {
					roomID: roomID,
					y: event.clientY - canvaRef.current.offsetTop,
				});
			});
		}
		window.addEventListener("keydown", (event) => {
			if (event.key === "w") {
				socket?.emit("move", {
					roomID: roomID,
					key: { upKey: true, downKey: false },
					isPressed: true,
				});
			} else if (event.key === "s") {
				socket?.emit("move", {
					roomID: roomID,
					key: { upKey: false, downKey: true },
					isPressed: true,
				});
			}
		});
		window.addEventListener("keyup", (event) => {
			if (event.key === "w") {
				socket?.emit("move", {
					roomID: roomID,
					key: { upKey: true, downKey: false },
					isPressed: false,
				});
			} else if (event.key === "s") {
				socket?.emit("move", {
					roomID: roomID,
					key: { upKey: false, downKey: true },
					isPressed: false,
				});
			}
		});
		return () => {
			window.removeEventListener("keydown", (event) => {
				if (event.key === "w") {
					socket?.emit("move", {
						roomID: roomID,
						key: { upKey: true, downKey: false },
						isPressed: true,
					});
				} else if (event.key === "s") {
					socket?.emit("move", {
						roomID: roomID,
						key: { upKey: false, downKey: true },
						isPressed: true,
					});
				}
			});
			window.removeEventListener("keyup", (event) => {
				if (event.key === "w") {
					socket?.emit("move", {
						roomID: roomID,
						key: { upKey: true, downKey: false },
						isPressed: false,
					});
				} else if (event.key === "s") {
					socket?.emit("move", {
						roomID: roomID,
						key: { upKey: false, downKey: true },
						isPressed: false,
					});
				}
			});
		};
	}, [player, roomID, socket, window]);

	useEffect(() => {
		socket?.on("win", (data) => {
			setGameStatus(1);
		});
		socket?.on("lose", (data) => {
			setGameStatus(2);
		});
		socket?.on("gameUpdate", (data) => {
			game.ball.x = data.ball.x * canvaRef.current.width / 900;
			game.ball.y = data.ball.y * canvaRef.current.height / 800;
			game.paddle1.y = data.paddle1.y * canvaRef.current.height / 800;
			game.paddle2.y = data.paddle2.y * canvaRef.current.height / 800;
		});
		socket?.on("player1Score", (data) => {
			setPlayer1Score(data);
		});
		socket?.on("player2Score", (data) => {
			setPlayer2Score(data);
		});
		if (roomID.length > 0) {
			if (mobile) {
				setCanvasWidth(300);
				setCanvasHeight(500);
			}
			socket?.emit("StartGame", {
				roomID,
				mobile,
			});
		}
		return () => {
			socket?.off("gameUpdate", (data) => {
				game.ball.x = data.ball.x * canvaRef.current.width / 900;
				game.ball.y = data.ball.y * canvaRef.current.height / 800;
				game.paddle1.y = data.paddle1.y * canvaRef.current.height / 800;
				game.paddle2.y = data.paddle2.y * canvaRef.current.height / 800;
			});
			socket?.off("player1Score", (data) => {
				setPlayer1Score(data);
			});
			socket?.off("player2Score", (data) => {
				setPlayer2Score(data);
			});
			socket?.off("win", (data) => {
				setGameStatus(1);
			});
			socket?.off("lose", (data) => {
				setGameStatus(2);
			});
			socket?.disconnect();
		};
	}, [socket, player, dispatch, roomID]);

	return (
		<PingPongContainer>
			<StyledCanvas
				style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
				ref={canvaRef}
			/>
			<ScoreWrapper>
				<ScoreUserInfoWrapper style={{ marginRight: "30px" }}>
					<GameProfileImg
						src={`http://localhost:3001/users/profile-image/${players.player1.profile_picture}`}
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
						src={`http://localhost:3001/users/profile-image/${players.player2.profile_picture}`}
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
