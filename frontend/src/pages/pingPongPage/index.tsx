import { useEffect, useState } from "react";
import PingPong from "../../components/pingPong";
import PlayForm from "../../components/playForm";
import { useAppSelector } from "../../hooks/reduxHooks";

const PingPongPage = () => {
  const { isGameStarted } = useAppSelector((state) => state.game);
  return <>{isGameStarted ? <PingPong /> : <PlayForm />}</>;
};

export default PingPongPage;
