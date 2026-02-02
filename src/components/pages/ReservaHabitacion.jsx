import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // ← AGREGADO useLocation
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

function ReservaHabitacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 

  const { fechaEntrada, fechaSalida } = location.state || {};
  const [habitacion, setHabitacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidadHuespedes, setCantidadHuespedes] = useState(1);

  // Obtener usuario para autocompletar
  const { user } = useAuth();
  const usuarioStorage =
    JSON.parse(sessionStorage.getItem("usuarioKey"))?.usuario || {};
  const usuarioActual = user || usuarioStorage;

  const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;
  const reservasBack = import.meta.env.VITE_API_RESERVAS;

  //Validar que existan las fechas
  useEffect(() => {
    if (!fechaEntrada || !fechaSalida) {
      Swal.fire({
        icon: "warning",
        title: "Fechas requeridas",
        text: "Debes seleccionar fechas antes de reservar.",
        confirmButtonText: "Ir a búsqueda",
      }).then(() => {
        navigate("/habitaciones");
      });
    }
  }, [fechaEntrada, fechaSalida, navigate]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await fetch(`${habitacionesBack}/${id}`);
        if (respuesta.ok) {
          const dato = await respuesta.json();
          setHabitacion(dato);
          // Inicializar huéspedes según capacidad
          if (dato.capacidad === 1) {
            setCantidadHuespedes(1);
          }
        }
      } catch (error) {
        console.error("Error al cargar habitación:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id, habitacionesBack]);

  // Calcular cantidad de noches
  const calcularNoches = () => {
    if (!fechaEntrada || !fechaSalida) return 1;
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    const diferencia = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
    return diferencia > 0 ? diferencia : 1;
  };

  const noches = calcularNoches();

  const handleConfirmar = async () => {
    try {
      const session = JSON.parse(sessionStorage.getItem("usuarioKey"));

      // Verificamos sesión
      if (!session || !session.token) {
        Swal.fire({
          icon: "warning",
          title: "Inicia Sesión",
          text: "Debes estar logueado para realizar una reserva.",
        });
        return;
      }

      const miId = session.usuario.id || session.usuario._id;

      //Validar cantidad de huéspedes
      if (cantidadHuespedes > habitacion.capacidad) {
        Swal.fire({
          icon: "error",
          title: "Capacidad excedida",
          text: `Esta habitación tiene capacidad para ${habitacion.capacidad} personas máximo.`,
        });
        return;
      }

      // Pregunta de confirmación
      const result = await Swal.fire({
        title: "Confirmar Reserva",
        html: `
          <p>¿Estás seguro de reservar la habitación ${habitacion?.numero}?</p>
          <p><strong>Fechas:</strong> ${fechaEntrada} al ${fechaSalida}</p>
          <p><strong>Huéspedes:</strong> ${cantidadHuespedes}</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, confirmar reserva",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        // Mostramos loading mientras procesa
        Swal.fire({
          title: "Procesando reserva...",
          didOpen: () => Swal.showLoading(),
        });

        const respuestaReserva = await fetch(
          `${reservasBack || habitacionesBack.replace("/habitaciones", "/reservas")}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-token": session.token,
            },
            body: JSON.stringify({
              habitacion: id, 
              usuario: miId, 
              fechaEntrada: fechaEntrada,
              fechaSalida: fechaSalida,
              cantidadHuespedes: cantidadHuespedes,
            }),
          },
        );

        const dataReserva = await respuestaReserva.json();

        if (!respuestaReserva.ok) {
          throw new Error(dataReserva.error || "Error al crear la reserva");
        }

        // Si todo salió bien:
        await Swal.fire({
          icon: "success",
          title: "¡Reserva Exitosa!",
          html: `
            <p>Tu reserva ha sido confirmada.</p>
            <p><strong>Habitación:</strong> ${habitacion.numero}</p>
            <p><strong>Fechas:</strong> ${fechaEntrada} al ${fechaSalida}</p>
          `,
        });
        navigate("/mi-reserva");
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

  const precioBase = (habitacion.precio || 0) * noches; 
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

          {/* ← NUEVO: Campo de huéspedes */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-normal text-muted">
              Cantidad de Huéspedes
            </Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={habitacion.capacidad}
              value={cantidadHuespedes}
              onChange={(e) => setCantidadHuespedes(parseInt(e.target.value))}
              className="p-2"
            />
            <Form.Text className="text-muted">
              Capacidad máxima: {habitacion.capacidad} personas
            </Form.Text>
          </Form.Group>
        </Form>
      </div>

      {/* ← NUEVO: Mostrar fechas seleccionadas */}
      <div className="p-4 mb-4 rounded border shadow-sm bg-white">
        <h5 className="fw-bold mb-3">Detalles de tu Reserva</h5>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Entrada:</span>
          <span className="fw-semibold">{fechaEntrada}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted">Salida:</span>
          <span className="fw-semibold">{fechaSalida}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Noches:</span>
          <span className="fw-semibold">{noches}</span>
        </div>
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
            <span className="text-secondary">
              Alojamiento ({noches} {noches === 1 ? "Noche" : "Noches"})
            </span>
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
            CONFIRMAR RESERVA
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default ReservaHabitacion;
