// Auth gate for routes. Used as a layout route in App.jsx.
import { useAuth } from "@clerk/react";

// Navigate redirects declaratively; Outlet renders the matched child route.
// Docs: https://reactrouter.com/start/declarative/routing
import { Navigate, Outlet } from "react-router-dom";

import { CollectionsProvider } from "@/context/CollectionsContext";

export default function ProtectedRoute() {
  // isLoaded is false until Clerk has finished checking the session.
  // isSignedIn tells us whether there's an authenticated user.
  // Docs: https://clerk.com/docs/references/react/use-auth
  const { isSignedIn, isLoaded } = useAuth();

  // Render nothing until Clerk resolves, to avoid a flicker or a wrong redirect.
  if (!isLoaded) return null;

  // Not signed in: send them to the sign-in page. replace avoids pushing the
  // guarded URL onto history (so Back doesn't loop them here).
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  // Signed in: provide the shared collections list to every page, the sidebar,
  // and the Add Link picker, then render whichever child route matched.
  return (
    <CollectionsProvider>
      <Outlet />
    </CollectionsProvider>
  );
}
