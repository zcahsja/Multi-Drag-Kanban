import React from "react";
import ReactDOM from "react-dom/client";
import { MultiSelectKanban } from "./components/MultiSelectKanban";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <MultiSelectKanban />
  </React.StrictMode>
);
