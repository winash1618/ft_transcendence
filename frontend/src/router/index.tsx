import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Layout";
import PageNotFound404 from "../pages/errorPages/pageNotFound";
import LeaderBoardPage from "../pages/leaderBoardPage";
import MessagesPage from "../pages/messagesPage";
import NickNamePage from "../pages/nickNamePage";
import PingPongPage from "../pages/pingPongPage";
import ProfilePage from "../pages/profilePage";
import SettingsPage from "../pages/settingsPage";
import AuthenticatePage from "../pages/authenticatePage";
import HomePage from "../pages/homePage";
import AchievementsPage from "../pages/achievementsPage";

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      { path: "/", element: <LeaderBoardPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/pingpong", element: <PingPongPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/profile/:login", element: <ProfilePage /> },
      { path: "/set-nickname", element: <NickNamePage /> },
      { path: "/achievements", element: <AchievementsPage /> },
    ],
  },
  { path: "/login", element: <HomePage /> },
  { path: "*", element: <PageNotFound404 /> },
  { path: "/authenticate", element: <AuthenticatePage /> },
]);
