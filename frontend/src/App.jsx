// Defines the route table. Each <Route> maps a URL path to a page component.
// Docs: https://reactrouter.com/start/declarative/routing
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import SignInPage from "@/pages/SignIn";
import Dashboard from "@/pages/Dashboard";
import Links from "@/pages/Links";
import Favorites from "@/pages/Favorites";
import Collection from "@/pages/Collection";
import Tags from "@/pages/Tags";

export default function App() {
  return (
    <Routes>
      {/* Public route: the sign-in page is reachable without auth. */}
      <Route path="/sign-in" element={<SignInPage />} />

      {/* A layout route with no path. ProtectedRoute renders an <Outlet/> for
          its children only when the user is signed in, so every nested route
          below is gated behind auth. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/links" element={<Links />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* ":id" is a dynamic segment, read inside the page via useParams(). */}
        <Route path="/collections/:id" element={<Collection />} />
        <Route path="/tags" element={<Tags />} />
      </Route>
    </Routes>
  );
}
