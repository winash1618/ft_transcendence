import { useEffect } from "react";
import PingPong from "../../components/pingPong";
import axios from "axios";

const PingPongPage = () => {
	useEffect(() => {
		axios.post("http://localhost:3001", { withCredentials: true });
	}, []);
	return (
		<>
			<PingPong />
		</>
	);
};

export default PingPongPage;
