import { Link, useLocation, useNavigate } from "react-router";
import "./AdminNavbar.css";
import { FaBed, FaUsers, FaSignOutAlt, FaFolderPlus } from "react-icons/fa";
import { useState } from "react";
import { ModalHabitacionerForm } from "../ui/ModalHabitacionerForm";

const AdminNavbar = ({ onLogout, setUsuarioLogueado }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const menuItems = [
    { path: "/admin-habitaciones", label: "Habitaciones", icon: FaBed },
    { path: "/admin-habitaciones", label: "Agregar Habitación", icon: FaFolderPlus, action: handleShow},
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
    <>
      <nav className="admin-navbar">
        <div className="admin-navbar-header">
          <div className="admin-navbar-logo">
            <img src="/foto/LogoFinal.png" alt="Logo" />
          </div>
          <p className="admin-navbar-subtitle">Admin Panel</p>
        </div>

        <div className="admin-navbar-menu">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            // Si tiene path, renderizamos un Link (Navegación)
            if (item.path) {
              const isActive = location.pathname === item.path && !item.action;
              
              const handleClick = (e) => {
                if (item.action) {
                  e.preventDefault();
                  item.action();
                }
              };

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`admin-navbar-item ${isActive ? "active" : ""}`}
                  onClick={handleClick}
                >
                  <Icon className="admin-navbar-icon" />
                  <span className="admin-navbar-label">{item.label}</span>
                </Link>
              );
            }

            // Si NO tiene path, renderizamos un Botón (Acción como abrir Modal)
            return (
              <button
                key={index}
                onClick={item.action}
                className="admin-navbar-item"
                style={{
                  background: "none",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  color: "inherit",
                  font: "inherit",
                }}
              >
                <Icon className="admin-navbar-icon" />
                <span className="admin-navbar-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="admin-navbar-footer">
          <button
            className="admin-navbar-item admin-navbar-logout"
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              width: "100%",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaSignOutAlt className="admin-navbar-icon" />
            <span className="admin-navbar-label">Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      {/* El componente del modal */}
      <ModalHabitacionerForm show={show} onHide={handleClose} />
    </>
  );
};

export default AdminNavbar;
