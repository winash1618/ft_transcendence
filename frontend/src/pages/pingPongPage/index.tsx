import { useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";

const PingPongPage = () => {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [player, setPlayer] = useState<number>(1);
  const [roomID, setRoomID] = useState<string>('');
  return (
    <>
      {isGameStarted ? (
        <PingPong player={player} roomID={roomID} />
      ) : (
        <PlayForm setIsGameStarted={setIsGameStarted} setPlayer={setPlayer} setRoomID={setRoomID} />
      )}
    </>
  );
};

export default PingPongPage;
