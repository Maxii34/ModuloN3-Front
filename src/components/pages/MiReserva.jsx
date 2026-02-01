import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MiReserva = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_RESERVAS;

  useEffect(() => {
    obtenerMisReservas();
  }, []);

  const obtenerMisReservas = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem("usuarioKey"));
      const token = session?.token;

      if (!token) {
        console.warn("⚠️ No hay token, redirigiendo al login");
        setLoading(false);
        Swal.fire({
          icon: "warning",
          title: "Sesión requerida",
          text: "Debes iniciar sesión para ver tus reservas",
        }).then(() => {
          navigate("/login"); 
        });
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "x-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Sesión expirada. Por favor, inicia sesión nuevamente.",
          );
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setReservas(data);
    } catch (error) {
      console.error("❌ Error al obtener reservas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudieron cargar tus reservas",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (idReserva, numeroHabitacion) => {
    try {
      const session = JSON.parse(sessionStorage.getItem("usuarioKey"));
      const token = session?.token;

      if (!token) {
        Swal.fire("Error", "No se encontró la sesión", "error");
        return;
      }

      const confirmacion = await Swal.fire({
        title: "¿Cancelar Reserva?",
        text: `¿Estás seguro que deseas cancelar la reserva de la habitación ${numeroHabitacion}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Mantener reserva",
      });

      if (!confirmacion.isConfirmed) {
        return;
      }

      Swal.fire({
        title: "Cancelando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(`${API_URL}/${idReserva}`, {
        method: "PUT",
        headers: {
          "x-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "No se pudo cancelar la reserva");
      }

      const result = await response.json();

      setReservas((prevReservas) =>
        prevReservas.filter((r) => r._id !== idReserva),
      );

      await Swal.fire({
        icon: "success",
        title: "¡Cancelada!",
        text: result.mensaje || "Tu reserva ha sido cancelada exitosamente.",
      });
    } catch (error) {
      console.error("Error al cancelar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un problema al intentar cancelar.",
      });
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <p className="mt-3 text-muted">Cargando tus reservas...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6">Mis Estancias</h2>
        <p className="text-secondary">Administra tus habitaciones reservadas</p>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-3 shadow-sm border">
          <div className="display-1 mb-3">🧳</div>
          <h3 className="fw-bold text-muted">Aún no tienes reservas</h3>
          <p className="mb-4">
            Parece que no has planificado tu próxima aventura con nosotros.
          </p>
          <Link to="/habitaciones">
            <Button variant="dark" size="lg" className="px-4 rounded">
              Explorar Habitaciones
            </Button>
          </Link>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {reservas.map((reserva) => {
            const habitacion = reserva.habitacion || {};

            return (
              <Col key={reserva._id}>
                <Card className="h-100 shadow border-0 overflow-hidden hover-effect">
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        habitacion.imagen ||
                        "https://via.placeholder.com/600x400?text=Hotel"
                      }
                      className="h-100 w-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/600x400?text=No+Image";
                      }}
                    />
                    <Badge
                      bg={
                        reserva.estado === "activa"
                          ? "success"
                          : reserva.estado === "cancelada"
                            ? "danger"
                            : "secondary"
                      }
                      className="position-absolute top-0 end-0 m-3 py-2 px-3 shadow-sm text-capitalize"
                    >
                      {reserva.estado === "activa"
                        ? "Confirmada"
                        : reserva.estado}
                    </Badge>
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Card.Title className="fw-bold text-capitalize mb-0">
                        {habitacion.tipo || "Habitación"}
                      </Card.Title>
                      <span className="text-muted small">
                        #{habitacion.numero || "N/A"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-muted small me-2">📅</span>
                        <small>
                          <strong>Check-in:</strong>{" "}
                          {new Date(reserva.fechaEntrada).toLocaleDateString(
                            "es-AR",
                          )}
                        </small>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-muted small me-2">📅</span>
                        <small>
                          <strong>Check-out:</strong>{" "}
                          {new Date(reserva.fechaSalida).toLocaleDateString(
                            "es-AR",
                          )}
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-muted small me-2">👥</span>
                        <small>
                          <strong>Huéspedes:</strong>{" "}
                          {reserva.cantidadHuespedes}
                        </small>
                      </div>
                    </div>

                    <Card.Text className="text-secondary small flex-grow-1">
                      {habitacion.descripcion
                        ? habitacion.descripcion.substring(0, 80) + "..."
                        : "Disfruta de tu estadía en nuestro hotel."}
                    </Card.Text>

                    <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary fs-5">
                        ${habitacion.precio?.toLocaleString("es-AR") || "N/A"}
                      </span>

                      {reserva.estado === "activa" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleCancelar(reserva._id, habitacion.numero)
                          }
                        >
                          Cancelar
                        </Button>
                      )}

                      {reserva.estado === "cancelada" && (
                        <Badge bg="secondary">Cancelada</Badge>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MiReserva;
