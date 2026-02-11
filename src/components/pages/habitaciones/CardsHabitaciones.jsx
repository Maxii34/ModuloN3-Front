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

  
  const calcularEstado = (habitacion) => {
    // Si está en mantenimiento, ese estado prevalece sobre todo
    if (habitacion.estado === "mantenimiento") {
      return "mantenimiento";
    }

    // Si no hay reservas, usar el estado manual de la habitación
    if (!habitacion.reservas || habitacion.reservas.length === 0) {
      return habitacion.estado || "disponible";
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const reservasActivas = habitacion.reservas.filter((r) => r.estado === "activa");
    
    // Si no hay reservas activas, usar el estado manual de la habitación
    if (reservasActivas.length === 0) {
      return habitacion.estado || "disponible";
    }

    // Verificar si hay una reserva actual (ocupada)
    const reservaActual = reservasActivas.find((r) => {
      const entrada = new Date(r.fechaEntrada);
      const salida = new Date(r.fechaSalida);
      entrada.setHours(0, 0, 0, 0);
      salida.setHours(0, 0, 0, 0);
      return hoy >= entrada && hoy < salida;
    });

    if (reservaActual) return "ocupada";
    
    // Verificar si hay reservas futuras
    const reservaFutura = reservasActivas.find((r) => new Date(r.fechaEntrada) > hoy);
    if (reservaFutura) return "reservada";
    
    // Si no hay reservas que afecten el estado actual, usar el estado manual
    return habitacion.estado || "disponible";
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

  //obtiene los colores segun el estado
  const obtenerColorEstado = (estado) => {
    const colores = {
      disponible: "success",
      ocupada: "danger",
      reservada: "warning",
      mantenimiento: "secondary"
    };
    return colores[estado] || "secondary";
  };

  return (
    <>
      <Row className="g-4">
        {habitaciones.map((hab) => {
          const estadoCalculado = calcularEstado(hab);
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

                  <Badge 
                    bg={obtenerColorEstado(estadoCalculado)}
                    className="fw-bold text-capitalize d-block"
                  >
                    {estadoCalculado}
                  </Badge>

                  {infoReserva && estadoCalculado !== "mantenimiento" && (
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
                          className="p-0 text-muted text-decoration-none btn btn-light pe-1 " 
                          onClick={() => handleShow(infoReserva)}
                        >
                          <i className="bi bi-eye-fill ms-1"></i> Ver
                        </Button>
                      </small>
                    </div>
                  )}

                  {estadoCalculado === "mantenimiento" && (
                    <div className="mb-2">
                      <small className="text-muted">
                        <i className="bi bi-tools me-1"></i>
                        Habitación en mantenimiento
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