import { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import CardsHabitacionesPublic from "./habitaciones/CardsHabitacionesPublic";
import "./BusquedaDisponibilidad.css";

const Habitaciones = () => {
  // Estados de filtros visuales
  // Estados de filtros visuales
  const [fechaEntrada, setFechaEntrada] = useState(
    sessionStorage.getItem("fechaEntrada") || "", // ← NUEVO
  );
  const [fechaSalida, setFechaSalida] = useState(
    sessionStorage.getItem("fechaSalida") || "", // ← NUEVO
  );
  const [huespedes, setHuespedes] = useState(2);
  const [numHabitaciones, setNumHabitaciones] = useState(1);

  // Obtener la fecha de hoy en formato YYYY-MM-DD para el input date
  const today = new Date().toISOString().split("T")[0];

  // Obtener la fecha mínima de salida (día siguiente a la llegada)
  const getMinCheckOutDate = () => {
    if (!fechaEntrada) return today;

    const checkIn = new Date(fechaEntrada);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split("T")[0];
  };

  // Manejar cambio en fecha de llegada
  const handleFechaEntradaChange = (e) => {
    const newFechaEntrada = e.target.value;
    setFechaEntrada(newFechaEntrada);
    sessionStorage.setItem("fechaEntrada", newFechaEntrada);

    // Si la fecha de salida es anterior o igual a la nueva fecha de llegada, resetearla
    if (fechaSalida && newFechaEntrada) {
      const checkOut = new Date(fechaSalida);
      const checkIn = new Date(newFechaEntrada);
      if (checkOut <= checkIn) {
        setFechaSalida("");
        sessionStorage.removeItem("fechaSalida");
      }
    }
  };

  // Estado para ordenar
  const [orden, setOrden] = useState("precio-asc");

  //ESTADO PARA LOS DATOS REALES (Empieza vacío)
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;

  //FUNCIÓN PARA TRAER DATOS DEL BACKEND
  const obtenerHabitaciones = async () => {
    try {
      const respuesta = await fetch(habitacionesBack);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setHabitaciones(datos); // Guardamos los datos de MongoDB
      } else {
        console.error("Error al obtener habitaciones del servidor");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // 4. USEEFFECT: Carga los datos al iniciar la página
  useEffect(() => {
    obtenerHabitaciones();
  }, []);

  // Función para filtrar habitaciones según los criterios de búsqueda
  const filtrarHabitaciones = () => {
    // Validar que se hayan seleccionado fechas
    if (!fechaEntrada || !fechaSalida) {
      Swal.fire({
        icon: "warning",
        title: "Fechas requeridas",
        text: "Por favor, selecciona las fechas de llegada y salida para realizar la búsqueda.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Convertir fechas a objetos Date
    const fechaEntradaObj = new Date(fechaEntrada);
    const fechaSalidaObj = new Date(fechaSalida);

    // Validar que fecha de entrada sea anterior a fecha de salida
    if (fechaEntradaObj >= fechaSalidaObj) {
      Swal.fire({
        icon: "error",
        title: "Fechas inválidas",
        text: "La fecha de salida debe ser posterior a la fecha de entrada.",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Filtrar habitaciones según los criterios
    let habitacionesFiltradas = habitaciones.filter((hab) => {
      //Filtrar por capacidad (huéspedes)
      const cumpleCapacidad = hab.capacidad >= huespedes;

      //Verificar disponibilidad por fechas (NUEVO)
      let estaDisponible = true;

      if (hab.reservas && hab.reservas.length > 0) {
        // Verificar si alguna reserva se superpone con las fechas solicitadas
        const hayConflicto = hab.reservas.some((reserva) => {
          const reservaEntrada = new Date(reserva.fechaEntrada);
          const reservaSalida = new Date(reserva.fechaSalida);

          // Normalizar fechas para comparar solo días (sin horas)
          reservaEntrada.setHours(0, 0, 0, 0);
          reservaSalida.setHours(0, 0, 0, 0);
          const entradaTemp = new Date(fechaEntradaObj);
          const salidaTemp = new Date(fechaSalidaObj);
          entradaTemp.setHours(0, 0, 0, 0);
          salidaTemp.setHours(0, 0, 0, 0);

          // Hay conflicto si las fechas se superponen
          return (
            (entradaTemp >= reservaEntrada && entradaTemp < reservaSalida) ||
            (salidaTemp > reservaEntrada && salidaTemp <= reservaSalida) ||
            (entradaTemp <= reservaEntrada && salidaTemp >= reservaSalida)
          );
        });

        estaDisponible = !hayConflicto; // Disponible si NO hay conflicto
      }
      // Si no tiene reservas, está disponible

      return cumpleCapacidad && estaDisponible;
    });

    // Si se requieren múltiples habitaciones, verificar que haya suficientes disponibles
    if (numHabitaciones > 1) {
      if (habitacionesFiltradas.length < numHabitaciones) {
        Swal.fire({
          icon: "info",
          title: "Disponibilidad limitada",
          text: `Solo encontramos ${habitacionesFiltradas.length} habitación(es) disponible(s) para ${huespedes} huésped(es) en las fechas seleccionadas.`,
          confirmButtonText: "Entendido",
        });
      }
    }

    // Actualizar el estado de habitaciones filtradas
    setHabitacionesFiltradas(habitacionesFiltradas);
    setBusquedaRealizada(true);

    // Mostrar mensaje si no hay resultados
    if (habitacionesFiltradas.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No se encontraron habitaciones",
        text: `No hay habitaciones disponibles para ${huespedes} huésped(es) en las fechas seleccionadas. Intenta con otras fechas o número de huéspedes.`,
        confirmButtonText: "Entendido",
      });
    }
  };

  // Ordenador (Funciona igual, pero ahora con datos reales)
  const ordenarHabitaciones = (data) => {
    // Creamos una copia para no mutar el estado original
    const copia = [...data];

    switch (orden) {
      case "precio-asc":
        return copia.sort((a, b) => a.precio - b.precio);
      case "precio-desc":
        return copia.sort((a, b) => b.precio - a.precio);
      case "nombre-asc":
        return copia.sort((a, b) => a.tipo.localeCompare(b.tipo));
      case "nombre-desc":
        return copia.sort((a, b) => b.tipo.localeCompare(a.tipo));
      default:
        return copia;
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h1 className="text-center fw-bold">Encuentra tu estancia perfecta</h1>
      <p className="text-center text-muted mb-4">
        Utiliza los filtros para encontrar la habitación ideal para tus fechas y
        necesidades.
      </p>

      {/* Formulario de Búsqueda de Disponibilidad */}
      <div className="busqueda-disponibilidad-form">
        <div className="busqueda-form-group">
          <label htmlFor="llegada">Llegada</label>
          <div className="busqueda-input-wrapper">
            <input
              type="date"
              id="llegada"
              value={fechaEntrada}
              onChange={handleFechaEntradaChange}
              min={today}
              className="busqueda-form-input busqueda-date-input"
            />
            <i className="bi bi-calendar3 busqueda-input-icon"></i>
          </div>
        </div>

        <div className="busqueda-form-group">
          <label htmlFor="salida">Salida</label>
          <div className="busqueda-input-wrapper">
            <input
              type="date"
              id="salida"
              value={fechaSalida}
              onChange={(e) => {
                setFechaSalida(e.target.value);
                sessionStorage.setItem("fechaSalida", e.target.value); // ← AGREGAR
              }}
              min={getMinCheckOutDate()}
              disabled={!fechaEntrada}
              className="busqueda-form-input busqueda-date-input"
            />
            <i className="bi bi-calendar3 busqueda-input-icon"></i>
          </div>
        </div>

        <div className="busqueda-form-group">
          <label htmlFor="huespedes">Huéspedes</label>
          <div className="busqueda-input-wrapper">
            <select
              id="huespedes"
              value={huespedes}
              onChange={(e) => setHuespedes(Number(e.target.value))}
              className="busqueda-form-input"
            >
              <option value="1">1 Huésped</option>
              <option value="2">2 Huéspedes</option>
              <option value="3">3 Huéspedes</option>
              <option value="4">4 Huéspedes</option>
              <option value="5">5+ Huéspedes</option>
            </select>
            <i className="bi bi-chevron-down busqueda-input-icon"></i>
          </div>
        </div>

        <div className="busqueda-form-group">
          <label htmlFor="habitaciones">Habitaciones</label>
          <div className="busqueda-input-wrapper">
            <select
              id="habitaciones"
              value={numHabitaciones}
              onChange={(e) => setNumHabitaciones(Number(e.target.value))}
              className="busqueda-form-input"
            >
              <option value="1">1 Habitación</option>
              <option value="2">2 Habitaciones</option>
              <option value="3">3 Habitaciones</option>
              <option value="4">4 Habitaciones</option>
              <option value="5">5+ Habitaciones</option>
            </select>
            <i className="bi bi-chevron-down busqueda-input-icon"></i>
          </div>
        </div>

        <button className="busqueda-button" onClick={filtrarHabitaciones}>
          Ver Disponibilidad
        </button>
      </div>

      {/* Título + Ordenar */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="fw-bold">Resultados para tu búsqueda</h3>
        </Col>

        <Col xs="12" md="4" lg="3" className="text-md-end mt-3 mt-md-0">
          <Form.Select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="shadow-sm"
          >
            <option value="precio-asc">Precio: más bajo</option>
            <option value="precio-desc">Precio: más alto</option>
            <option value="nombre-asc">Nombre: A–Z</option>
            <option value="nombre-desc">Nombre: Z–A</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Cards - Mostramos habitaciones filtradas si hay búsqueda, sino todas */}
      {habitaciones.length > 0 ? (
        <>
          {busquedaRealizada && habitacionesFiltradas.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted"></i>
              <h4 className="mt-3 text-muted">No se encontraron resultados</h4>
              <p className="text-muted">
                No hay habitaciones disponibles con los criterios seleccionados.
                <br />
                Intenta ajustar las fechas o el número de huéspedes.
              </p>
            </div>
          ) : (
            <CardsHabitacionesPublic
              habitaciones={ordenarHabitaciones(
                busquedaRealizada ? habitacionesFiltradas : habitaciones,
              )}
              fechaEntrada={fechaEntrada} // ← Debe estar aquí
              fechaSalida={fechaSalida} // ← Debe estar aquí
            />
          )}
          {busquedaRealizada && habitacionesFiltradas.length > 0 && (
            <div className="text-center mt-3">
              <p className="text-muted">
                Se encontraron <strong>{habitacionesFiltradas.length}</strong>{" "}
                habitación(es) disponible(s)
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando habitaciones...</p>
        </div>
      )}
    </Container>
  );
};

export default Habitaciones;
