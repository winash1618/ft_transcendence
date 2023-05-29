import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store";
import { Provider } from "react-redux";
import { GlobalStyle } from "./globalStyle";
import { injectStore } from "./api";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";

injectStore(store);
injectStyle();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <ToastContainer />
    <GlobalStyle />
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
