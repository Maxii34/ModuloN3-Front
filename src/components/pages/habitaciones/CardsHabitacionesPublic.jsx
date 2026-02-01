import { Card, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../../context/AuthContext";

const CardsHabitacionesPublic = ({ habitaciones, loginShow, fechaEntrada, fechaSalida }) => {
  const navigate = useNavigate();
  const { user } = useAuth();


  const handleReservarClick = (idHabitacion) => {
    // 1. Verificamos si hay usuario logueado
    const usuarioStorage = JSON.parse(sessionStorage.getItem("usuarioKey"));

    if (user || (usuarioStorage && usuarioStorage.token)) {
      // === ESCENARIO 1: USUARIO LOGUEADO ===
      
      // ← NUEVO: Verificar que haya fechas seleccionadas
      if (!fechaEntrada || !fechaSalida) {
        Swal.fire({
          icon: "warning",
          title: "Fechas requeridas",
          text: "Por favor, selecciona las fechas de llegada y salida antes de reservar.",
          confirmButtonText: "Entendido",
        });
        return;
      }

      // ← MODIFICADO: Navegar pasando las fechas en el state
      navigate(`/detalle/${idHabitacion}`, {
        state: {
          fechaEntrada: fechaEntrada,
          fechaSalida: fechaSalida
        }
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
            <Card.Body>
              <h5 className="fw-bold text-capitalize">{hab.tipo}</h5>
              <p className="text-muted small mb-2">
                Hab. {hab.numero} - {hab.capacidad} Huéspedes
              </p>
              <p className="fw-bold fs-4 text-primary mb-0">${hab.precio}</p>
            </Card.Body>

            <Card.Footer className="bg-white border-0 pb-3">
              <Button
                variant="dark"
                className="w-100 py-2 rounded-3"
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