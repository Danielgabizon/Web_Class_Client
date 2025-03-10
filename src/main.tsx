import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AuthProvider from "./components/AuthProvider.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="589760171721-rb65vs1o46udps44ttklprslnvrh39v4.apps.googleusercontent.com">
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
