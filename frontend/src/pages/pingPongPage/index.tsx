import { useEffect } from "react";
import axios from "../../api";
import PingPong from "../../components/pingPong";

const PingPongPage = () => {
  useEffect(() => {
    axios.post("http://localhost:3001/");
  }, []);
  return (
    <>
      <PingPong />
    </>
  );
};

export default PingPongPage;
