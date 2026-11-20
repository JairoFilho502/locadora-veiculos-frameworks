import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Carregando from "./Carregando";

function ProtectedRoute({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <Carregando texto="Verificando sessão..." />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
