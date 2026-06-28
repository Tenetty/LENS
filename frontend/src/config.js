export const BACKEND_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://lens-dnbn.onrender.com";

export const API_URL = `${BACKEND_URL}/api`;
