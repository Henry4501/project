// Entry point. This file mounts React into the DOM and wraps the whole app
// in the context providers every page depends on.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// BrowserRouter enables client-side routing using the HTML5 history API.
// Everything that uses routes/links must live inside it.
// Docs: https://reactrouter.com/start/declarative/routing
import { BrowserRouter } from "react-router-dom";

// ClerkProvider makes auth state (useAuth, useUser, etc.) available app-wide.
// Docs: https://clerk.com/docs/quickstarts/react
import { ClerkProvider } from "@clerk/react";

// TooltipProvider is required by shadcn's Tooltip (the sidebar uses tooltips
// when collapsed). It must wrap any component that renders a Tooltip.
// Docs: https://ui.shadcn.com/docs/components/tooltip
import { TooltipProvider } from "@/components/ui/tooltip";

import "./index.css";
import App from "./App.jsx";

// Vite exposes env vars prefixed with VITE_ on import.meta.env. The publishable
// key is safe for the browser (unlike the secret key, which stays on the server).
// Docs: https://vite.dev/guide/env-and-mode
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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
