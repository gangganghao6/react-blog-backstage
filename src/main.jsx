import React from "react";
import ReactDOM from "react-dom";
import "./assets/style/base.scss";
import App from "./App";
import { HashRouter } from "react-router-dom";
import "antd/dist/antd.css";
// window.url='http://192.168.31.30:8082';
window.url='http://39.105.105.42:8082'
ReactDOM.render(
  // <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
