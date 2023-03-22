import { useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";

const PingPongPage = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  return (
    <>
      {isGameStarted ? (
        <PingPong />
      ) : (
        <PlayForm setIsGameStarted={setIsGameStarted} />
      )}
    </>
  );
};

export default PingPongPage;
