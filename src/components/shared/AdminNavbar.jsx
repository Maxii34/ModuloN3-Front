import { Link, useLocation, useNavigate } from "react-router";
import "./AdminNavbar.css";
import {
  FaBed,
  FaUsers,
  FaSignOutAlt,
  FaShoppingBag,
  FaFolderPlus
} from "react-icons/fa";

// Agregamos onOpenModal a los props (o define tu función dentro si prefieres)
const AdminNavbar = ({ onLogout, setUsuarioLogueado, onOpenModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin-habitaciones", label: "Habitaciones", icon: FaBed },
    { 
      label: "Agregar Habitación", 
      icon: FaFolderPlus, 
      action: onOpenModal || (() => console.log("Abriendo modal...")) 
    },
    { path: "/admin-usuarios", label: "Usuarios", icon: FaUsers },
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setUsuarioLogueado({});
    sessionStorage.removeItem("usuarioKey");
    navigate("/");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-header">
        <div className="admin-navbar-logo">
          <img src="/foto/LogoFinal.png" alt="" />
        </div>
        <p className="admin-navbar-subtitle">Admin Panel</p>
      </div>

      <div className="admin-navbar-menu">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          
          // Lógica condicional:
          // Si tiene "path", usamos Link. Si no, usamos button.
          if (item.path) {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index} // Usamos index o item.path como key
                to={item.path}
                className={`admin-navbar-item ${isActive ? "active" : ""}`}
              >
                <Icon className="admin-navbar-icon" />
                <span className="admin-navbar-label">{item.label}</span>
              </Link>
            );
          } else {
            // Renderizado del botón para el Modal
            return (
              <button
                key={index}
                onClick={item.action} // Ejecuta la función del modal
                className="admin-navbar-item" // Usamos la MISMA clase para mantener el estilo
                style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }} // Ajustes inline para que parezca link
              >
                <Icon className="admin-navbar-icon" />
                <span className="admin-navbar-label">{item.label}</span>
              </button>
            );
          }
        })}
      </div>

      <div className="admin-navbar-footer">
        <button
          className="admin-navbar-item admin-navbar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="admin-navbar-icon" />
          <span className="admin-navbar-label">Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;