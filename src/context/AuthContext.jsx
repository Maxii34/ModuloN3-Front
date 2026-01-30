import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [userData, setUserData] = useState(null);

  // Verificar si hay un admin guardado en localStorage al cargar
  useEffect(() => {
    const savedAdmin = localStorage.getItem("adminAuth");
    if (savedAdmin) {
      try {
        const admin = JSON.parse(savedAdmin);
        setIsAdmin(true);
        setAdminData(admin);
      } catch (error) {
        console.error("Error al cargar datos del admin:", error);
        localStorage.removeItem("adminAuth");
      }
    }

    // Verificar si hay un usuario guardado en localStorage al cargar
    const savedUser = localStorage.getItem("userAuth");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsUser(true);
        setUserData(user);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        localStorage.removeItem("userAuth");
      }
    }
  }, []);

  const loginAdmin = (adminInfo) => {
    setIsAdmin(true);
    setAdminData(adminInfo);
    localStorage.setItem("adminAuth", JSON.stringify(adminInfo));
    // Limpiar sesión de usuario si existe
    setIsUser(false);
    setUserData(null);
    localStorage.removeItem("userAuth");
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminData(null);
    localStorage.removeItem("adminAuth");
  };

  const loginUser = (userInfo) => {
    setIsUser(true);
    setUserData(userInfo);
    localStorage.setItem("userAuth", JSON.stringify(userInfo));
    // Limpiar sesión de admin si existe
    setIsAdmin(false);
    setAdminData(null);
    localStorage.removeItem("adminAuth");
  };

  const logoutUser = () => {
    setIsUser(false);
    setUserData(null);
    localStorage.removeItem("userAuth");
  };

  const logout = () => {
    logoutAdmin();
    logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        adminData,
        loginAdmin,
        logoutAdmin,
        isUser,
        userData,
        loginUser,
        logoutUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
