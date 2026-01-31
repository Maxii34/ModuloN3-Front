import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../index.css";
import CardsHabitaciones from "../pages/habitaciones/CardsHabitaciones";
import ModalEditarHabitacion from "../ui/ModalEditarHabitacion";
import { crearHabitacion } from "../helpers/queries";
import { eliminarHabitacion } from "../../services/habitacionesAPI";

const AdminHabitaciones = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [habitaciones, setHabitaciones] = useState([]);

  // ESTADOS PARA EL MODAL
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

  // CREAR (POST)
  const onSubmit = async (data) => {
    try {
      const habitacionNueva = {
        numero: parseInt(data.numero),
        tipo: data.tipo,
        precio: parseFloat(data.precio),
        estado: data.estado,
        imagen: data.imagen,
        capacidad: parseInt(data.capacidad),
        piso: parseInt(data.piso),
        metros: parseInt(data.metrosCuadrados),
        caracteristicas: data.caracteristicas,
        descripcion: data.descripcion,
      };

      // Validación simple de campos numéricos requeridos
      if (
        !Number.isFinite(habitacionNueva.numero) ||
        !Number.isFinite(habitacionNueva.precio) ||
        !Number.isFinite(habitacionNueva.capacidad) ||
        !Number.isFinite(habitacionNueva.piso) ||
        !Number.isFinite(habitacionNueva.metros)
      ) {
        Swal.fire(
          "Error",
          "Completa correctamente los campos numéricos.",
          "error",
        );
        return;
      }

      if (habitacionNueva.precio < 0) {
        Swal.fire("Error", "El precio debe ser mayor o igual a 0", "error");
        return;
      }

      const respuesta = await crearHabitacion(habitacionNueva);
      if (respuesta && respuesta.status === 201) {
        Swal.fire({
          title: "¡Creada!",
          text: "La habitación se guardó correctamente",
          icon: "success",
        });
        reset();
        obtenerHabitaciones();
      } else if (respuesta) {
        const mensaje =
          respuesta.datos?.mensaje ||
          respuesta.datos?.msg ||
          "No se pudo guardar la habitación";
        console.error("Error al crear habitación:", respuesta.datos);
        Swal.fire("Error", mensaje, "error");
      } else {
        Swal.fire("Error", "No se pudo guardar la habitación", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message || "Fallo de conexión", "error");
    }
  };

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
          Swal.fire("¡Eliminado!", "La habitación fue eliminada.", "success");
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

  // LÓGICA DEL MODAL
  const handleEditarHabitacion = (habitacion) => {
    setHabitacionSeleccionada(habitacion);
    setShowModalEditar(true);
  };

  const handleHabitacionEditada = () => {
    obtenerHabitaciones();
  };

  return (
    <Container className="my-5">
      <Row className="gap-4 justify-content-center">
        {/* COLUMNA IZQUIERDA: FORMULARIO CREAR */}
        <Col md={4} className="p-4 border rounded bg-light">
          <h3 className="mb-4 fw-bold">Agregar Nueva Habitación</h3>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 101"
                {...register("numero", {
                  required: "El número de habitación es obligatorio",
                  min: { value: 1, message: "El número debe ser mayor a 0" },
                })}
              />
              {errors.numero && (
                <span className="text-danger small">
                  {errors.numero.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                {...register("tipo", {
                  required: "Seleccione un tipo de habitación",
                })}
              >
                <option value="">Seleccionar tipo</option>
                <option value="individual">Individual</option>
                <option value="doble">Doble</option>
                <option value="matrimonial">Matrimonial</option>
                <option value="suite">Suite</option>
                <option value="familiar">Familiar</option>
              </Form.Select>
              {errors.tipo && (
                <span className="text-danger small">{errors.tipo.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio ($)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 5000"
                {...register("precio", {
                  required: "El precio es obligatorio",
                  min: {
                    value: 0,
                    message: "El precio debe ser mayor o igual a 0",
                  },
                })}
              />
              {errors.precio && (
                <span className="text-danger small">
                  {errors.precio.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                placeholder="Personas"
                {...register("capacidad", {
                  required: "La capacidad es obligatoria",
                  min: { value: 1, message: "Mínimo 1 persona" },
                })}
              />
              {errors.capacidad && (
                <span className="text-danger small">
                  {errors.capacidad.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Piso</Form.Label>
              <Form.Control
                type="number"
                {...register("piso", {
                  required: "El piso es obligatorio",
                  min: { value: 0, message: "Piso no válido" },
                })}
              />
              {errors.piso && (
                <span className="text-danger small">{errors.piso.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Metros Cuadrados</Form.Label>
              <Form.Control
                type="number"
                {...register("metrosCuadrados", {
                  required: "Los metros cuadrados son obligatorios",
                  min: { value: 1, message: "Debe ser mayor a 0" },
                })}
              />
              {errors.metrosCuadrados && (
                <span className="text-danger small">
                  {errors.metrosCuadrados.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Características</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: wifi, aire acondicionado"
                {...register("caracteristicas", {
                  required: "Las características son obligatorias",
                  minLength: { value: 5, message: "Debe ser más descriptivo" },
                })}
                {...register("caracteristicas", {
                  required: "Las características son obligatorias",
                  minLength: {
                    value: 2,
                    message: "Mínimo 2 caracteres",
                  },
                  maxLength: {
                    value: 50,
                    message: "Máximo 50 caracteres permitidos",
                  },
                })}
              />
              {errors.caracteristicas && (
                <span className="text-danger small">
                  {errors.caracteristicas.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 10,
                    message: "Mínimo 10 caracteres",
                  },
                  maxLength: {
                    value: 500,
                    message: "Máximo 500 caracteres permitidos",
                  },
                })}
              />
              {errors.descripcion && (
                <span className="text-danger small">
                  {errors.descripcion.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <div className="d-flex flex-wrap gap-3 mt-2">
                {["disponible", "ocupada", "reservada", "mantenimiento"].map(
                  (estado) => (
                    <Form.Check
                      type="radio"
                      key={estado}
                      label={estado.charAt(0).toUpperCase() + estado.slice(1)}
                      value={estado}
                      {...register("estado", {
                        required: "Seleccione un estado",
                      })}
                    />
                  ),
                )}
              </div>
              {errors.estado && (
                <span className="text-danger small">
                  {errors.estado.message}
                </span>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Imagen URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://..."
                {...register("imagen", {
                  required: "La URL de la imagen es obligatoria",
                  pattern: {
                    value: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                    message: "Debe ser una URL válida (http/https)",
                  },
                })}
              />
              {errors.imagen && (
                <span className="text-danger small">
                  {errors.imagen.message}
                </span>
              )}
            </Form.Group>

            <Button variant="dark" type="submit" className="w-100">
              Guardar Habitación
            </Button>
          </Form>
        </Col>

        {/* COLUMNA DERECHA: LISTADO */}
        <Col md={7} className="p-4 border rounded bg-white">
          <h3 className="mb-4 fw-bold">Habitaciones Existentes</h3>
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
