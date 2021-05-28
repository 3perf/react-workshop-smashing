import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

const root = document.getElementById("root");
const isServerSideRenderingEnabled = root.innerHTML.trim().length > 0;
if (isServerSideRenderingEnabled) {
  ReactDOM.hydrate(<App />, root);
} else {
  ReactDOM.render(<App />, root);
}
