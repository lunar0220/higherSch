// Защита страниц кабинета: если ученик не вошёл, отправляем его на страницу входа.
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="status container">Загрузка…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
