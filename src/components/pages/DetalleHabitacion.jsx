import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const DetalleHabitacion = () => {
  const { id } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;


  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const respuesta = await fetch(
          `${habitacionesBack}/${id}`
        );
        if (respuesta.ok) {
          const dato = await respuesta.json();
          setHabitacion(dato);
        } else {
          console.error("No se encontró la habitación");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    cargarDetalle();
  }, [id]);

  if (cargando) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!habitacion) {
    return (
      <Container className="my-5">
        <h3>Habitación no encontrada</h3>
      </Container>
    );
  }

  // --- CÁLCULOS DE PRECIO ---
  const precioBase = habitacion.precio;
  const impuestos = precioBase * 0.02; // 2%
  const total = precioBase + impuestos;
  // --------------------------

  // Helper para saber si está disponible
  const disponible = habitacion.estado === "disponible";

  return (
    <Container className="my-5">
      <Row>
        {/* Columna Izquierda: Imagen y Detalles */}
        <Col md={7}>
          <div className="fixed-height-image w-100 mb-4">
            <img
              src={
                habitacion.imagenes ||
                habitacion.imagen ||
                "https://via.placeholder.com/800x400"
              }
              alt={`Habitación ${habitacion.numero}`}
              className="imgDetalle w-100 rounded shadow-sm"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Sin+Imagen";
              }}
            />
          </div>

          <div className="mb-5">
            <h3 className="fw-bold text-center text-capitalize">
              {habitacion.tipo} - Habitación {habitacion.numero}
            </h3>
            <p className="text-center fw-light">
              Piso {habitacion.piso} · Para {habitacion.capacidad} personas
            </p>

            <div className="my-4">
              <h5 className="fw-bold">Descripción:</h5>
              <p>{habitacion.descripcion}</p>
            </div>

            <div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="bi bi-aspect-ratio me-2"></i>
                  <strong>Tamaño:</strong> {habitacion.metros} m²
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-stars me-2"></i>
                  <strong>Características:</strong> {habitacion.caracteristicas}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Estado:</strong>
                  <span className="ms-1 text-capitalize">
                    {habitacion.estado}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        </Col>

        {/* Columna Derecha: Formulario de Reserva y Resumen */}
        <Col md={5}>
          <Card className="p-4 shadow border-0">
            <h3 className="fw-bold mb-4">Resumen de Reserva</h3>

            {/* Resumen de Costos */}
            <div className="mt-2">
              <Row className="mb-2">
                <Col>Precio por noche</Col>
                <Col className="text-end">${precioBase.toLocaleString()}</Col>
              </Row>
              <Row className="mb-3 text-muted">
                <Col>Impuestos y tasas (2%)</Col>
                <Col className="text-end">${impuestos.toFixed(2)}</Col>
              </Row>
              <hr />
              <Row className="fw-bold fs-5 my-3">
                <Col>Total Estimado</Col>
                <Col className="text-end text-primary">
                  ${total.toLocaleString()}
                </Col>
              </Row>
            </div>

            {disponible ? (
              <Alert variant="success" className="mt-2 text-center">
                <i className="bi bi-check-circle-fill me-2"></i>
                ¡Disponible para reservar!
              </Alert>
            ) : (
              <Alert variant="warning" className="mt-2 text-center">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                Esta habitación figura como: {habitacion.estado}
              </Alert>
            )}

            <div className="d-grid gap-2 mt-3">
              {/* LÓGICA CORREGIDA: */}
              {disponible ? (
                /* CASO 1: DISPONIBLE (Botón dentro de Link) */
                <Link
                  to={`/reserva/${habitacion._id || habitacion.id}`}
                  className="d-grid text-decoration-none"
                >
                  <Button variant="dark" size="lg" className="w-100">
                    Continuar con la Reserva
                  </Button>
                </Link>
              ) : (
                /* CASO 2: NO DISPONIBLE (Solo botón disabled, sin Link) */
                <Button
                  variant="dark"
                  size="lg"
                  className="w-100"
                  disabled={true}
                >
                  Continuar con la Reserva
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleHabitacion;