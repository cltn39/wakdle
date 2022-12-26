import "react-toastify/dist/ReactToastify.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <>
    <App />
    <ToastContainer />
  </>,
);
