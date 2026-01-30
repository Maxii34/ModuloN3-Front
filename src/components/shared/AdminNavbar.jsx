import { Link, useLocation, useNavigate } from "react-router";
import "./AdminNavbar.css";
import {
  FaBed,
  FaUsers,
  FaSignOutAlt,
  FaShoppingBag,
} from "react-icons/fa";

const AdminNavbar = ({ onLogout, setUsuarioLogueado }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin-habitaciones", label: "Habitaciones", icon: FaBed },
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-navbar-item ${isActive ? "active" : ""}`}
            >
              <Icon className="admin-navbar-icon" />
              <span className="admin-navbar-label">{item.label}</span>
            </Link>
          );
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
