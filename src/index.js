import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { DragProvider } from "./DragContext";

if (window.alt === undefined) {
  window.alt = {
      emit: () => { },
      on: () => { },
  };
}


function OpenInventory() {
  document.getElementById("app").style.display = "block";
}

function CloseInventory() {
  document.getElementById("app").style.display = "none";
  window.alt.emit('CloseInventory');
}
window.OpenInventory = OpenInventory;
window.CloseInventory = CloseInventory;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DragProvider>
      <App />
    </DragProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.onload = ()=>window.alt.emit('loaded');

window.alt.on('open', ()=>OpenInventory());
window.alt.on('close', ()=>CloseInventory());