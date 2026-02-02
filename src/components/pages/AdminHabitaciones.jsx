import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../index.css";
import CardsHabitaciones from "../pages/habitaciones/CardsHabitaciones";
import ModalEditarHabitacion from "../ui/ModalEditarHabitacion";
import { eliminarHabitacion } from "../../services/habitacionesAPI";

const AdminHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);

  // ESTADOS PARA EL MODAL DE EDITAR
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

  const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;

  // LEER (GET)
  const obtenerHabitaciones = async () => {
    try {
      const respuesta = await fetch(habitacionesBack);
      const datos = await respuesta.json();
      setHabitaciones(datos);
    } catch (error) {
      console.error("Error al cargar habitaciones:", error);
    }
  };

  useEffect(() => {
    obtenerHabitaciones();
  }, []);

  // BORRAR (DELETE)
  const borrarHabitacion = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respuesta = await eliminarHabitacion(id);

        if (respuesta && (respuesta.status === 200 || respuesta.ok)) {
          // Actualizamos el estado local
          setHabitaciones(
            habitaciones.filter((hab) => (hab._id || hab.id) !== id),
          );
          Swal.fire({
            title: "¡Eliminado!",
            text: "La habitación fue eliminada correctamente.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        } else {
          Swal.fire(
            "Error",
            "No se pudo eliminar. Verifique si tiene permisos de administrador.",
            "error",
          );
        }
      }
    });
  };

  // LÓGICA DEL MODAL EDITAR
  const handleEditarHabitacion = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setShowModalEditar(true);
  };

  const handleHabitacionEditada = () => {
    obtenerHabitaciones();
  };

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold display-6 text-center mb-2">
            Administración de Habitaciones
          </h2>
        </Col>
      </Row>

      <Row>
        <Col md={4} lg={12} className="p-4 border rounded bg-white">
          <h3 className="mb-4 fw-bold text-center text-muted">
            Habitaciones Existentes
          </h3>
          {habitaciones.length > 0 ? (
            <CardsHabitaciones
              habitaciones={habitaciones}
              borrarHabitacion={borrarHabitacion}
              onEditarHabitacion={handleEditarHabitacion}
            />
          ) : (
            <p className="text-muted">No hay habitaciones registradas.</p>
          )}
        </Col>
      </Row>

      {/* MODAL PARA EDITAR HABITACIÓN */}
      <ModalEditarHabitacion
        show={showModalEditar}
        onHide={() => {
          setShowModalEditar(false);
          setHabitacionSeleccionada(null);
        }}
        habitacion={habitacionSeleccionada}
        onHabitacionEditada={handleHabitacionEditada}
      />
    </Container>
  );
};

export default AdminHabitaciones;
