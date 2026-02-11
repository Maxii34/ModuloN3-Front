import { useEffect, useState } from "react";
import { Button, Modal, Badge } from "react-bootstrap";

export const ModalVerReservasActivas = ({
  show,
  handleClose,
  formatearFecha,
  infoReserva,
}) => {
  const [datosUsuario, setDatosUsuario] = useState({});

  const API_USUARIOS = import.meta.env.VITE_API_USUARIOS;

  useEffect(() => {
    const obtenerNombreUsuario = async () => {
      // Verificamos que tenemos el ID del usuario
      const idUsuario = infoReserva?.reserva?.usuario;

      if (show && idUsuario) {
        try {
          const usuarioKey = JSON.parse(sessionStorage.getItem("usuarioKey"));
          const token = usuarioKey?.token;

          const resp = await fetch(`${API_USUARIOS}/${idUsuario}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-token": token,
            },
          });
          if (resp.ok) {
            const data = await resp.json();
            setDatosUsuario(data.usuario || data);
          }
        } catch (error) {
          console.error("Error al obtener el usuario");
        }
      }
    };

    if (show) {
      obtenerNombreUsuario();
    } else {
      // Limpiamos el nombre al cerrar el modal
      setDatosUsuario("");
    }
  }, [show, infoReserva?.reserva?.usuario, API_USUARIOS]);

  if (!infoReserva) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Estado de la Reserva */}
        <div className="text-center mb-4">
          {infoReserva.tipo === "actual" ? (
            <Badge bg="danger" className="px-3 py-2 shadow-sm">
              <i className="bi bi-person-fill me-1"></i> Ocupada actualmente
            </Badge>
          ) : (
            <Badge bg="warning" text="dark" className="px-3 py-2 shadow-sm">
              <i className="bi bi-calendar-check me-1"></i> Próxima reserva
            </Badge>
          )}
        </div>

        {/* Contenedor Principal Estilo "Card" */}
        <div className="border rounded p-3 bg-light shadow">
          <h5 className="mb-3 border-bottom pb-2">
            <i className="bi bi-info-circle-fill me-2 text-primary"></i>
            Detalles de la Estancia
          </h5>

          <div className="mb-2">
            <strong>
              <i className="bi bi-box-arrow-in-right me-2 text-success"></i>
              Check-in:
            </strong>{" "}
            <span className="text-dark">
              {formatearFecha(infoReserva.reserva.fechaEntrada)}
            </span>
          </div>

          <div className="mb-2">
            <strong>
              <i className="bi bi-box-arrow-left me-2 text-danger"></i>
              Check-out:
            </strong>{" "}
            <span className="text-dark">
              {formatearFecha(infoReserva.reserva.fechaSalida)}
            </span>
          </div>

          <div className="mb-0">
            <strong>
              <i className="bi bi-people-fill me-2 text-secondary"></i>
              Huéspedes:
            </strong>{" "}
            <span className="badge bg-white text-dark border ms-1">
              {infoReserva.reserva.cantidadHuespedes}{" "}
              {infoReserva.reserva.cantidadHuespedes === 1
                ? "persona"
                : "personas"}
            </span>
          </div>

          {/* Separador con Estilo */}
          <hr className="my-3" />

          <h5 className="mb-3 border-bottom pb-2">
            <i className="bi bi-person-badge-fill me-2 text-primary"></i>
            Información del Huesped
          </h5>

          <div className="row g-2">
            <div className="col-12">
              <strong>
                <i className="bi bi-person me-2"></i>Nombre:
              </strong>{" "}
              <span className="text-muted text-capitalize">
                {datosUsuario.nombre} {datosUsuario.apellido}
              </span>
            </div>
            <div className="col-12">
              <strong>
                <i className="bi bi-envelope me-2"></i>Email:
              </strong>{" "}
              <span className="text-muted text-capitalize">
                {datosUsuario.email}
              </span>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
