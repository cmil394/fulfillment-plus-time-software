import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Auth from "./Auth/Auth";
import Dashboard from "./Dashboard/Dashboard";
import Customers from "./Customers/Customers";
import Tasks from "./Tasks/Tasks";

function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Auth /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/customers"
        element={user ? <Customers /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/tasks/:customerId"
        element={user ? <Tasks /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default Home;
