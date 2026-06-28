import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;

  return <Outlet />;
}
