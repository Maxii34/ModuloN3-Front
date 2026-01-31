import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
// Si no usas esta función, puedes borrar la importación, pero la dejo por si acaso.
import { asignarHabitacionUsuario } from "../../services/usuariosAPI";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

function ReservaHabitacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habitacion, setHabitacion] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Obtener usuario para autocompletar
  const { user } = useAuth();
  const usuarioStorage =
    JSON.parse(sessionStorage.getItem("usuarioKey"))?.usuario || {};
  const usuarioActual = user || usuarioStorage;

  const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await fetch(`${habitacionesBack}/${id}`);
        if (respuesta.ok) {
          const dato = await respuesta.json();
          setHabitacion(dato);
        }
      } catch (error) {
        console.error("Error al cargar habitación:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id, habitacionesBack]);

  const handleConfirmar = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem("usuarioKey"));

      // Verificamos sesión
      if (!session || !session.token) {
        Swal.fire({
            icon: 'warning',
            title: 'Inicia Sesión',
            text: 'Debes estar logueado para realizar una reserva.'
        });
        return;
      }

      const miId = session.usuario.id || session.usuario._id;

      // Pregunta de confirmación
      const result = await Swal.fire({
        title: "Confirmar Reserva",
        text: `¿Estás seguro de reservar la habitación ${habitacion?.numero}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, pagar ahora",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        // Mostramos loading mientras procesa
        Swal.fire({
            title: 'Procesando...',
            didOpen: () => Swal.showLoading()
        });

        const habitacionActualizada = { 
            ...habitacion, 
            estado: "reservada",
            usuario: miId
        };

        const respuestaEstado = await fetch(
          `${habitacionesBack}/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-token": session.token,
            },
            body: JSON.stringify(habitacionActualizada),
          }
        );

        if (!respuestaEstado.ok) {
           throw new Error("Error al guardar la reserva en la base de datos.");
        }

        // Asignar la habitación al usuario
        await asignarHabitacionUsuario(miId, id, session.token);

        // Si todo salió bien:
        await Swal.fire({
          icon: "success",
          title: "¡Reserva Exitosa!",
          text: "La habitación ha sido asignada correctamente a tu cuenta.",
        });
        
        // Redirigimos a la página de inicio o a mis reservas
        navigate("/");
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al procesar la reserva",
      });
    }
  };

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Cargando datos de la reserva...</p>
      </Container>
    );
  }

  if (!habitacion) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Habitación no encontrada</Alert>
      </Container>
    );
  }

  const precioBase = habitacion.precio || 0;
  const impuestos = precioBase * 0.02;
  const total = precioBase + impuestos;

  return (
    <Container className="py-5" style={{ maxWidth: "650px" }}>
      <h1 className="mb-1 fw-bold text-center">Checkout de Reserva</h1>
      <p className="text-secondary text-center mb-5">
        Completa tu información para asegurar tu habitación.
      </p>

      {/* === SECCIÓN 1: Formulario === */}
      <div className="p-4 mb-4 bg-light rounded shadow-sm">
        <h3 className="mb-3 border-bottom pb-2">1. Tu Contacto</h3>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-normal text-muted">
              Nombre Completo
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Tu Nombre"
              className="p-2"
              defaultValue={usuarioActual.nombre}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-normal text-muted">
              Correo Electrónico
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@correo.com"
              className="p-2"
              defaultValue={usuarioActual.email}
              readOnly
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="fw-normal text-muted">Teléfono</Form.Label>
            <Form.Control
              type="tel"
              placeholder="+XX XXX XXX XXXX"
              className="p-2"
            />
          </Form.Group>
        </Form>
      </div>

      <div className="p-4 rounded border shadow-sm">
        <h5 className="fw-bold">
          {habitacion.tipo} – Habitación {habitacion.numero}
        </h5>
      </div>

      <hr className="my-5" />

      {/* === SECCIÓN 2: Resumen === */}
      <div className="p-4 rounded bg-white border shadow-sm">
        <div className="mb-4 border-bottom pb-3">
          <div
            className="w-100 mb-2 rounded overflow-hidden"
            style={{ maxHeight: "150px" }}
          >
            <img
              src={
                habitacion.imagenes ||
                habitacion.imagen ||
                "https://via.placeholder.com/800x400"
              }
              alt={habitacion.tipo}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/800x400?text=Sin+Imagen";
              }}
            />
          </div>
          <h5 className="fw-bold mt-2 text-capitalize">
            {habitacion.tipo} - Habitación {habitacion.numero}
          </h5>
        </div>

        <h4 className="mb-3">Desglose de Costos</h4>

        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item className="d-flex justify-content-between bg-white border-0 py-2">
            <span className="text-secondary">Alojamiento (1 Noche)</span>
            <span>${precioBase.toLocaleString()}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between">
            <span>Impuestos (2%)</span>
            <span>${impuestos.toFixed(2)}</span>
          </ListGroup.Item>
        </ListGroup>

        <div className="pt-3 border-top mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="h5 fw-bold text-dark">TOTAL FINAL:</span>
            <span className="h4 fw-bold text-primary">
              ${total.toLocaleString()}
            </span>
          </div>

          <Button
            variant="dark"
            size="lg"
            className="w-100 fw-bold"
            onClick={handleConfirmar}
          >
            CONFIRMAR PAGO
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default ReservaHabitacion;