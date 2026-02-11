import { Card, Button, Col, Row, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ModalVerReservasActivas } from "./ModalVerReservasActivas";
import { useState } from "react";

const CardsHabitaciones = ({ habitaciones, borrarHabitacion, onEditarHabitacion }) => {
  const [show, setShow] = useState(false);
  // Nuevo estado para saber qué reserva mostrar en el modal
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const handleClose = () => {
    setShow(false);
    setReservaSeleccionada(null);
  };

  const handleShow = (info) => {
    setReservaSeleccionada(info);
    setShow(true);
  };

  const calcularEstado = (reservas) => {
    if (!reservas || reservas.length === 0) return "disponible";
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const reservasActivas = reservas.filter((r) => r.estado === "activa");
    if (reservasActivas.length === 0) return "disponible";

    const reservaActual = reservasActivas.find((r) => {
      const entrada = new Date(r.fechaEntrada);
      const salida = new Date(r.fechaSalida);
      entrada.setHours(0, 0, 0, 0);
      salida.setHours(0, 0, 0, 0);
      return hoy >= entrada && hoy < salida;
    });

    if (reservaActual) return "ocupada";
    const reservaFutura = reservasActivas.find((r) => new Date(r.fechaEntrada) > hoy);
    return reservaFutura ? "reservada" : "disponible";
  };

  const obtenerInfoReserva = (reservas) => {
    if (!reservas || reservas.length === 0) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const reservasActivas = reservas.filter((r) => r.estado === "activa");

    const actual = reservasActivas.find((r) => {
      const entrada = new Date(r.fechaEntrada);
      const salida = new Date(r.fechaSalida);
      entrada.setHours(0, 0, 0, 0);
      salida.setHours(0, 0, 0, 0);
      return hoy >= entrada && hoy < salida;
    });

    if (actual) return { tipo: "actual", reserva: actual };

    const futuras = reservasActivas
      .filter((r) => new Date(r.fechaEntrada) > hoy)
      .sort((a, b) => new Date(a.fechaEntrada) - new Date(b.fechaEntrada));

    return futuras.length > 0 ? { tipo: "proxima", reserva: futuras[0] } : null;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Row className="g-4">
        {habitaciones.map((hab) => {
          const estadoCalculado = calcularEstado(hab.reservas);
          const infoReserva = obtenerInfoReserva(hab.reservas);

          return (
            <Col md={3} key={hab._id || hab.id}>
              <Card className="h-100 shadow-sm card-room">
                <Card.Img
                  variant="top"
                  src={hab.imagenes || hab.imagen || hab.img}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
                  }}
                />

                <Card.Body>
                  <Card.Title>Habitación {hab.numero}</Card.Title>

                  <span className={`fw-bold text-capitalize d-block mb-2 ${
                      estadoCalculado === "disponible" ? "text-success" : 
                      estadoCalculado === "ocupada" ? "text-danger" : "text-warning"
                    }`}
                  >
                    {estadoCalculado}
                  </span>

                  {infoReserva && (
                    <div className="mb-2">
                      <small>
                        {infoReserva.tipo === "actual" ? (
                          <Badge bg="danger" className="me-2">
                            <i className="bi bi-person-fill me-1"></i>
                            Ocupada ahora
                          </Badge>
                        ) : (
                          <Badge bg="warning" text="dark" className="me-2">
                            <i className="bi bi-calendar-check me-1"></i>
                            Próxima reserva
                          </Badge>
                        )}
                        <Button 
                          variant="link" 
                          className="p-0 text-muted text-decoration-none" 
                          onClick={() => handleShow(infoReserva)}
                        >
                          <i className="bi bi-eye-fill ms-1"></i> Ver
                        </Button>
                      </small>
                    </div>
                  )}

                  <Card.Text className="text-capitalize">{hab.tipo}</Card.Text>
                  <Card.Text className="fw-bold">
                    ${hab.precio} / noche
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="d-flex justify-content-between bg-white border-top-0 pb-3 gap-1">
                  <Button
                    variant="primary"
                    className="btn-room"
                    onClick={() => onEditarHabitacion(hab)}
                  >
                    <i className="bi bi-pencil-fill"></i> Editar
                  </Button>

                  <Button
                    variant="danger"
                    className="btn-room"
                    onClick={() => borrarHabitacion(hab._id || hab.id)}
                  >
                    <i className="bi bi-trash-fill"></i> Eliminar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      <ModalVerReservasActivas
        show={show}
        handleClose={handleClose}
        formatearFecha={formatearFecha}
        infoReserva={reservaSeleccionada} 
      />
    </>
  );
};

export default CardsHabitaciones;