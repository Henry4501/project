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
      <Route path="/sign-in" element={<SignInPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/links" element={<Links />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/collections/:id" element={<Collection />} />
        <Route path="/tags" element={<Tags />} />
      </Route>
    </Routes>
  );
}
