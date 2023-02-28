import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Layout";
import HomePage from "../pages/homePage";

export const router = createBrowserRouter([
    {
      element: <Navbar />,
      children: [{ path: "/", element: <HomePage /> }],
    },
  ]);