import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedUserRoute = ({ children }) => {
  const { isUser } = useAuth();

  if (!isUser) {
    // Redirigir a la página de inicio si no está autenticado como usuario
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedUserRoute;
