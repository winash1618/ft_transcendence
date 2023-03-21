import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Layout";
import LeaderBoardPage from "../pages/leaderBoardPage";
import MessagesPage from "../pages/messagesPage";
import PingPongPage from "../pages/pingPongPage";
import SettingsPage from "../pages/settingsPage";

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      { path: "/", element: <LeaderBoardPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/pingpong", element: <PingPongPage /> },
	  { path: "/settings", element: <SettingsPage />}
    ],
  },
]);
