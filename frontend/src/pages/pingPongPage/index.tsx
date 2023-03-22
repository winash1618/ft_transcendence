import { useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";

const PingPongPage = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [player, setPlayer] = useState<number>(1);
  return (
    <>
      {isGameStarted ? (
        <PingPong player={player} />
      ) : (
        <PlayForm setIsGameStarted={setIsGameStarted} setPlayer={setPlayer} />
      )}
    </>
  );
};

export default PingPongPage;
