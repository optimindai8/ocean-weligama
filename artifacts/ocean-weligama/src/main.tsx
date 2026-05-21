import { createRoot } from "react-dom/client";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Configure API base URL
const isDev = import.meta.env.DEV;
setBaseUrl(isDev ? (import.meta.env.VITE_API_URL || "http://localhost:8080") : "");

// Configure Admin Authentication Token
setAuthTokenGetter(() => localStorage.getItem("ow-admin-token"));

createRoot(document.getElementById("root")!).render(<App />);
