import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

import store from "./redux/store";
import httpInterceptors from "./utils/httpClient/interceptors";
import App from "./App";

httpInterceptors.attach(store); // Pass store

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
