import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Layout";
import PageNotFound404 from "../pages/errorPages/pageNotFound";
import LeaderBoardPage from "../pages/leaderBoardPage";
import MessagesPage from "../pages/messagesPage";
import NickNamePage from "../pages/nickNamePage";
import PingPongPage from "../pages/pingPongPage";
import ProfilePage from "../pages/profilePage";
import SettingsPage from "../pages/settingsPage";

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/leaderboard", element: <LeaderBoardPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/pingpong", element: <PingPongPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/profile/:login", element: <ProfilePage /> },
      { path: "/set-nickname", element: <NickNamePage /> },
    ],
  },
  { path: "*", element: <PageNotFound404 /> },
]);
