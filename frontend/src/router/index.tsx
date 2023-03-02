import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Layout";
import LeaderBoardPage from "../pages/leaderBoardPage";
import MessagesPage from "../pages/messagesPage";
import PingPongPage from "../pages/pingPongPage";

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      { path: "/", element: <PingPongPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/leaderboard", element: <LeaderBoardPage /> },
    ],
  },
]);
