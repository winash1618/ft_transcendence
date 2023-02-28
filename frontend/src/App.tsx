import { RouterProvider } from "react-router-dom";
import { GlobalStyle } from "./globalStyle";
import { router } from "./router";

function App() {
  return (
    <div style={{ height: "100%" }}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
