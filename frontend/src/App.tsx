import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { getDemoUser } from "./session";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import CheckIn from "./pages/CheckIn";
import Dashboard from "./pages/Dashboard";

function RequireAuth({ children }: { children: ReactNode }) {
  return getDemoUser() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/check-in"
          element={
            <RequireAuth>
              <CheckIn />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
