import { StrictMode } from "react";
import { Router } from "./Router.jsx";
import { AuthProvider } from "./context/AuthContext.js";
import { Toaster } from "@/components/ui/sonner";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Router />
      <Toaster position="top-center" />
    </AuthProvider>
  </StrictMode>,
);
