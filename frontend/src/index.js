import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import axios from "axios";
import { AuthContextProvider } from "./context/authContext";

// Configure Axios to use the live Render backend URL
axios.defaults.baseURL = "https://tourism-backend-yrfx.onrender.com/api";

// Attach JWT token as Authorization header on every request
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
