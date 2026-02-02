import { Card, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../../context/AuthContext";

const CardsHabitacionesPublic = ({
  habitaciones,
  loginShow,
  fechaEntrada,
  fechaSalida,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReservarClick = (idHabitacion) => {
    // 1. Verificamos si hay usuario logueado
    const usuarioStorage = JSON.parse(sessionStorage.getItem("usuarioKey"));

    if (user || (usuarioStorage && usuarioStorage.token)) {
      // USUARIO LOGUEADO ===

      //Verificar que haya fechas seleccionadas
      if (!fechaEntrada || !fechaSalida) {
        Swal.fire({
          icon: "warning",
          title: "Fechas requeridas",
          text: "Por favor, selecciona las fechas de llegada y salida antes de reservar.",
          confirmButtonText: "Entendido",
        });
        return;
      }

      // Navegar pasando las fechas en el state
      navigate(`/reserva/${idHabitacion}`, {
        state: {
          fechaEntrada: fechaEntrada,
          fechaSalida: fechaSalida,
        },
      });
    } else {
      // === ESCENARIO 2: NO LOGUEADO ===
      Swal.fire({
        title: "Acceso Restringido",
        text: "Para reservar una habitación, necesitas iniciar sesión o registrarte primero.",
        icon: "warning",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          if (loginShow) {
            loginShow();
          }
        }
      });
    }
  };

  return (
    <Row className="g-4">
      {habitaciones.map((hab) => (
        <Col lg={4} md={6} key={hab._id || hab.id}>
          <Card className="h-100 shadow-sm rounded-4 overflow-hidden">
            <Card.Img
              variant="top"
              src={hab.imagenes || hab.imagen || hab.img}
              style={{ height: "210px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Sin+Imagen";
              }}
            />
            <Card.Body className="d-flex flex-column p-4">
              {/* Encabezado con badge o etiqueta de tipo */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="fw-bold text-capitalize mb-0">{hab.tipo}</h5>
                <span className="badge bg-light text-dark border">
                  № {hab.numero}
                </span>
              </div>

              {/* Detalles con iconos de texto o separación clara */}
              <p className="text-muted small mb-3">
                <i className="bi bi-people me-1"></i> {hab.capacidad} Huéspedes
              </p>

              {/* Precio destacado con "por noche" */}
              <div className="mt-auto">
                <p className="mb-0">
                  <span className="fw-bold fs-3 text-primary">
                    ${hab.precio}
                  </span>
                  <span className="text-muted small"> / noche</span>
                </p>
              </div>
            </Card.Body>

            <Card.Footer className="bg-white border-0 px-4 pb-4">
              <Button
                variant="dark"
                className="w-100 py-2 fw-bold shadow-sm rounded-3"
                onClick={() => handleReservarClick(hab._id || hab.id)}
              >
                Reservar Ahora
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardsHabitacionesPublic;
