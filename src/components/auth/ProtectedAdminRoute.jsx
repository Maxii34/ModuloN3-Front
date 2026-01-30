import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    // Redirigir a la página de inicio si no es admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
