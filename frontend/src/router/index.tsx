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

export const router = createBrowserRouter([
  {
    element: <Navbar />,
    children: [
      { path: "/", element: <LeaderBoardPage /> },
      { path: "/messages", element: <MessagesPage /> },
      { path: "/pingpong", element: <PingPongPage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/profile/:login", element: <ProfilePage /> },
      { path: "/set-nickname", element: <NickNamePage /> },
    ],
  },
  { path: "*", element: <PageNotFound404 /> },
  { path: "/authenticate", element: <AuthenticatePage /> },
]);
