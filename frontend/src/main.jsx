import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";
import App from "./App.jsx";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Clerk publishable key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.",
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
