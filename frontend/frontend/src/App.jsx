import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leads/:id"
        element={
          <ProtectedRoute>
            <LeadDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;