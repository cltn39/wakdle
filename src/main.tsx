import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <>
    <App />
    <ToastContainer />
    <ReactTooltip anchorId="wakdle" place="bottom" content='왁타버스 관련 키워드를 자모로 풀어쓴 한글 단어 "왁들"을 여섯 번의 도전 안에 맞춰봅시다.' />
    <ReactTooltip anchorId="hint" place="bottom" content="도움 주기" />
    <ReactTooltip anchorId="setting" place="bottom" content="설정" />
    <ReactTooltip anchorId="howtoplay" place="bottom" content="어떻게 할까?" />
    <ReactTooltip anchorId="stats" place="bottom" content="통계" />
  </>
);
