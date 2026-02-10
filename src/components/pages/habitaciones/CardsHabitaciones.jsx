import { Card, Button, Col, Row, Badge, Accordion } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const CardsHabitaciones = ({
  habitaciones,
  borrarHabitacion,
  onEditarHabitacion,
}) => {
  // Funcion para calcular estados de reservas de habitaciones
  const calcularEstado = (reservas) => {
    if (!reservas || reservas.length === 0) {
      return "disponible";
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Filtrar solo reservas activas
    const reservasActivas = reservas.filter((r) => r.estado === "activa");

    if (reservasActivas.length === 0) {
      return "disponible";
    }

    // Verificar si hay una reserva actual
    const reservaActual = reservasActivas.find((reserva) => {
      const entrada = new Date(reserva.fechaEntrada);
      const salida = new Date(reserva.fechaSalida);
      entrada.setHours(0, 0, 0, 0);
      salida.setHours(0, 0, 0, 0);

      return hoy >= entrada && hoy < salida;
    });

    if (reservaActual) {
      return "ocupada";
    }

    // Verificar si hay proximas reservas
    const reservaFutura = reservasActivas.find((reserva) => {
      const entrada = new Date(reserva.fechaEntrada);
      entrada.setHours(0, 0, 0, 0);
      return entrada > hoy;
    });

    if (reservaFutura) {
      return "reservada";
    }

    return "disponible";
  };

  // ← FUNCIÓN PARA OBTENER INFO DE LA PRÓXIMA RESERVA
  const obtenerInfoReserva = (reservas) => {
    if (!reservas || reservas.length === 0) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reservasActivas = reservas.filter((r) => r.estado === "activa");

    // Buscar reserva actual
    const actual = reservasActivas.find((r) => {
      const entrada = new Date(r.fechaEntrada);
      const salida = new Date(r.fechaSalida);
      entrada.setHours(0, 0, 0, 0);
      salida.setHours(0, 0, 0, 0);
      return hoy >= entrada && hoy < salida;
    });

    if (actual) {
      return { tipo: "actual", reserva: actual };
    }

    // Buscar próxima reserva futura
    const futuras = reservasActivas
      .filter((r) => new Date(r.fechaEntrada) > hoy)
      .sort((a, b) => new Date(a.fechaEntrada) - new Date(b.fechaEntrada));

    if (futuras.length > 0) {
      return { tipo: "proxima", reserva: futuras[0] };
    }

    return null;
  };

  // funcion para mostar las fechas de reservas
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
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
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=Sin+Imagen";
                }}
              />

              <Card.Body>
                <Card.Title>Habitación {hab.numero}</Card.Title>

                <span
                  className={`fw-bold text-capitalize d-block mb-2 ${
                    estadoCalculado === "disponible"
                      ? "text-success"
                      : estadoCalculado === "ocupada"
                        ? "text-danger"
                        : "text-warning"
                  }`}
                >
                  {estadoCalculado}
                </span>

                {infoReserva && (
                  <Accordion className="my">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
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
                          <span className="text-muted">Ver</span>
                        </small>
                      </Accordion.Header>
                      <Accordion.Body className="py-2">
                        <small>
                          <div className="mb-1">
                            <strong>Check-in:</strong>{" "}
                            {formatearFecha(infoReserva.reserva.fechaEntrada)}
                          </div>
                          <div className="mb-1">
                            <strong>Check-out:</strong>{" "}
                            {formatearFecha(infoReserva.reserva.fechaSalida)}
                          </div>
                          <div className="text-muted">
                            <i className="bi bi-people-fill me-1"></i>
                            {infoReserva.reserva.cantidadHuespedes}{" "}
                            {infoReserva.reserva.cantidadHuespedes === 1
                              ? "huésped"
                              : "huéspedes"}
                          </div>
                        </small>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}

                <Card.Text className="text-capitalize">{hab.tipo}</Card.Text>
                <Card.Text className="fw-bold">${hab.precio} / noche</Card.Text>
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
  );
};

export default CardsHabitaciones;
