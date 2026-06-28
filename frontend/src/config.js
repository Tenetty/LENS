export const BACKEND_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://tourism-backend-yrfx.onrender.com";

export const API_URL = `${BACKEND_URL}/api`;
