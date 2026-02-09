import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { crearHabitacion } from "../helpers/queries";
import { useHabitaciones } from "../context/HabitacionesContext";


export const ModalHabitacionForm = ({ show, onHide, onHabitacionCreada }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { notificarHabitacionCreada } = useHabitaciones()


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
        metros: parseInt(data.metros),
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

      // valida numero duplicado de habitaciones
      const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;
      const respuestaHabitaciones = await fetch(habitacionesBack);
      const habitacionesExistentes = await respuestaHabitaciones.json();

      const numeroYaExiste = habitacionesExistentes.some(
        (hab) => hab.numero === habitacionNueva.numero,
      );

      if (numeroYaExiste) {
        Swal.fire({
          icon: "warning",
          title: "Habitación Ya Registrada",
          text: `La habitación número ${habitacionNueva.numero} ya fue creada anteriormente. No puedes tener dos habitaciones con el mismo número.`,
          confirmButtonText: "Elegir otro número",
          confirmButtonColor: "#f39c12",
          footer:
            "Verifica los números disponibles en la lista de habitaciones",
        });
        return;
      }

      const respuesta = await crearHabitacion(habitacionNueva);
      if (respuesta && respuesta.status === 201) {
        if (onHabitacionCreada) {
          onHabitacionCreada();
        }
        notificarHabitacionCreada()

        Swal.fire({
          title: "¡Creada!",
          text: "La habitación se guardó correctamente",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
        reset();
        onHide(); 
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

  const handleClose = () => {
    reset();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Agregar Nueva Habitación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)} id="formHabitacion">
          <Row>
            {/* COLUMNA IZQUIERDA */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Número *</Form.Label>
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
                <Form.Label>Tipo *</Form.Label>
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
                  <span className="text-danger small">
                    {errors.tipo.message}
                  </span>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Precio ($) *</Form.Label>
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
                <Form.Label>Capacidad *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Número de personas"
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
                <Form.Label>Características *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Wi-Fi, A/C, TV"
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
            </Col>

            {/* COLUMNA DERECHA */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Piso *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Número de piso"
                  {...register("piso", {
                    required: "El piso es obligatorio",
                    min: { value: 0, message: "Piso no válido" },
                  })}
                />
                {errors.piso && (
                  <span className="text-danger small">
                    {errors.piso.message}
                  </span>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Metros Cuadrados *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="m²"
                  {...register("metros", {
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
                <Form.Label>Estado *</Form.Label>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {["disponible", "ocupada", "reservada", "mantenimiento"].map(
                    (estado) => (
                      <Form.Check
                        type="radio"
                        key={estado}
                        id={`estado-${estado}`}
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
                  <span className="text-danger small d-block mt-1">
                    {errors.estado.message}
                  </span>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Imagen URL *</Form.Label>
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
            </Col>
          </Row>

          {/* DESCRIPCIÓN - ANCHO COMPLETO */}
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Describa la habitación detalladamente..."
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
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="dark" type="submit" form="formHabitacion">
          Guardar Habitación
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
