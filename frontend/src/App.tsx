import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/homePage";

function App() {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [{ path: "/", element: <HomePage /> }],
    },
  ]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
