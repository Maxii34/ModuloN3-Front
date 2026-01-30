import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MiReserva = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL del Backend
  const API_URL = import.meta.env.VITE_API_HABITACIONES || "https://modulo-n-3-backend.vercel.app/api/habitaciones";

  useEffect(() => {
    obtenerMisReservas();
  }, []);

  const obtenerMisReservas = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem("usuarioKey"));
      const token = session?.token;
      const miId = session?.usuario?._id || session?.usuario?.id;

      if (!token || !miId) {
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        const misHabitaciones = data.filter((h) => {
          if (!h.usuario) return false;
          return (h.usuario._id === miId) || (h.usuario === miId);
        });
        setReservas(misHabitaciones);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "No se pudieron cargar tus reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN PARA CANCELAR RESERVA ---
  const handleCancelar = async (idHabitacion, numeroHabitacion) => {
    try {
      const session = JSON.parse(sessionStorage.getItem("usuarioKey"));
      const token = session?.token;

      if (!token) return;

      const confirmacion = await Swal.fire({
        title: "¿Cancelar Reserva?",
        text: `¿Estás seguro que deseas cancelar la habitación ${numeroHabitacion}? Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "Mantener reserva"
      });

      if (confirmacion.isConfirmed) {
        // Mostramos loading
        Swal.fire({ title: 'Cancelando...', didOpen: () => Swal.showLoading() });

        const habitacionActual = reservas.find(h => (h._id === idHabitacion) || (h.id === idHabitacion));

        const response = await fetch(`${API_URL}/${idHabitacion}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-token": token,
          },
          body: JSON.stringify({
            ...habitacionActual, 
            estado: "disponible", 
            usuario: null         
          }),
        });

        if (response.ok) {
          setReservas(prevReservas => prevReservas.filter(h => (h._id !== idHabitacion) && (h.id !== idHabitacion)));

          await Swal.fire("Cancelada", "Tu reserva ha sido cancelada exitosamente.", "success");
        } else {
          throw new Error("El servidor no pudo cancelar la reserva.");
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un problema al intentar cancelar.", "error");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
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
        <div className="text-center py-5 bg-light rounded-3 shadow-sm border border-dashed">
          <div className="display-1 mb-3">🧳</div>
          <h3 className="fw-bold text-muted">Aún no tienes reservas</h3>
          <p className="mb-4">Parece que no has planificado tu próxima aventura con nosotros.</p>
          <Link to="/habitaciones">
            <Button variant="dark" size="lg" className="px-4 rounded">
              Explorar Habitaciones
            </Button>
          </Link>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {reservas.map((habitacion) => (
            <Col key={habitacion._id || habitacion.id}>
              <Card className="h-100 shadow border-0 overflow-hidden hover-effect">
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <Card.Img
                    variant="top"
                    src={habitacion.imagen || "https://via.placeholder.com/600x400?text=Hotel"}
                    className="h-100 w-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
                  />
                  <Badge 
                    bg="success" 
                    className="position-absolute top-0 end-0 m-3 py-2 px-3 shadow-sm"
                  >
                    Confirmada
                  </Badge>
                </div>

                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="fw-bold text-capitalize mb-0">
                      {habitacion.tipo}
                    </Card.Title>
                    <span className="text-muted small">#{habitacion.numero}</span>
                  </div>
                  
                  <Card.Text className="text-secondary small flex-grow-1">
                    {habitacion.descripcion 
                      ? habitacion.descripcion.substring(0, 80) + "..." 
                      : "Habitación reservada."}
                  </Card.Text>

                  <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary fs-5">
                        ${habitacion.precio?.toLocaleString()}
                    </span>
                    
                    {/* BOTÓN DE CANCELAR */}
                    <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleCancelar(habitacion._id || habitacion.id, habitacion.numero)}
                    >
                      Cancelar Reserva
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MiReserva;