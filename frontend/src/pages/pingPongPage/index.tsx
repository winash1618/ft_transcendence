import { useEffect, useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";
import { useAppSelector } from "../../hooks/reduxHooks";
import { ErrorAlert } from "../../components/toastify";

const PingPongPage = () => {
	const { socket, isGameStarted } = useAppSelector((state) => state.game);

	useEffect(() => {
		socket?.on('exception', (error) => {
			ErrorAlert(error.error, 5000);
			console.log(error);
		});
		return () => {
			socket?.off('exception');
		};
	}, [socket]);

	return <>{isGameStarted ? <PingPong /> : <PlayForm />}</>;
};

export default PingPongPage;
