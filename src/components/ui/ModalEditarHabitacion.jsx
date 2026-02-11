import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { actualizarHabitacion } from "../../services/habitacionesAPI";

const ModalEditarHabitacion = ({
  show,
  onHide,
  habitacion,
  onHabitacionEditada,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Cargar datos de la habitación cuando se abre el modal
  useEffect(() => {
    if (habitacion && show) {
      setValue("numero", habitacion.numero);
      setValue("tipo", habitacion.tipo);
      setValue("precio", habitacion.precio);
      setValue("capacidad", habitacion.capacidad);
      setValue("piso", habitacion.piso);
      setValue("caracteristicas", habitacion.caracteristicas || "");
      setValue("descripcion", habitacion.descripcion || "");
      setValue("estado", habitacion.estado);
      setValue("metros", habitacion.metros);
      setValue("imagen", habitacion.imagen || habitacion.imagenes || "");
    }
  }, [habitacion, show, setValue]);

  // Reset form cuando se cierra el modal para evitar valores stale
  useEffect(() => {
    if (!show) {
      reset();
    }
  }, [show, reset]);

  const onSubmit = async (data) => {
    try {
      const id = habitacion._id || habitacion.id;

      const datosFormateados = {
        ...data,
        numero: Number(data.numero),
        precio: Number(data.precio),
        capacidad: Number(data.capacidad),
        piso: Number(data.piso),
        metros: Number(data.metros),
        imagen: data.imagen,
        estado: data.estado,
      };

      if (datosFormateados.precio < 0) {
        Swal.fire("Error", "El precio debe ser mayor o igual a 0", "error");
        return;
      }

      const respuesta = await actualizarHabitacion(id, datosFormateados);

      if (respuesta) {
        onHabitacionEditada(); // actualiza
        //reset(); //Recetea
        onHide(); // cierra modal

        Swal.fire({
          title: "¡Editada!",
          text: "La habitación ha sido actualizada correctamente.",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar. Revisa la conexión o tus permisos.",
        icon: "error",
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Habitación {habitacion?.numero}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Número de Habitación
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ej: 101"
                  {...register("numero", {
                    required: "El número de habitación es obligatorio",
                    min: { value: 1, message: "El número debe ser mayor a 0" },
                    max: {
                      value: 500,
                      message: "El número deve ser menos a 500",
                    },
                  })}
                />
                {errors.numero && (
                  <span className="text-danger small">
                    {errors.numero.message}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tipo de Habitación</Form.Label>
                <Form.Select
                  {...register("tipo", {
                    required: "Seleccione un tipo de habitación",
                  })}
                >
                  <option value="individual">Individual</option>
                  <option value="doble">Doble</option>
                  <option value="matrimonial">Matrimonial</option>
                  <option value="suite">Suite</option>
                  <option value="familiar">Familiar</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Precio ($)</Form.Label>
                <Form.Control
                  type="number"
                  {...register("precio", {
                    required: "El precio es obligatorio",
                    min: {
                      value: 0,
                      message: "El precio debe ser mayor o igual a 0",
                    },
                    max: {
                      value: 200000,
                      message: "El precio debe ser menor a 200,000",
                    },
                  })}
                />
                {errors.precio && (
                  <span className="text-danger small">
                    {errors.precio.message}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Capacidad</Form.Label>
                <Form.Control
                  type="number"
                  {...register("capacidad", {
                    required: "La capacidad es obligatoria",
                    min: {
                      value: 1,
                      message: "Mínimo de personas deve ser payor que 1",
                    },
                    max: {
                      value: 10,
                      message: "El miximo de persona deve ser menos a 10",
                    },
                  })}
                />
                {errors.capacidad && (
                  <span className="text-danger small">
                    {errors.capacidad.message}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Piso</Form.Label>
                <Form.Control
                  type="number"
                  {...register("piso", {
                    required: "El piso es obligatorio",
                    min: {
                      value: 0,
                      message: "El numero de piso deve ser mayor a 0",
                    },
                    max: {
                      value: 15,
                      message: "El numero de piso deve ser menor a 15",
                    },
                  })}
                />
                {errors.piso && (
                  <span className="text-danger small">
                    {errors.piso.message}
                  </span>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Metros Cuadrados</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ej: 25"
                  {...register("metros", {
                    required: "Los metros cuadrados son obligatorios",
                    min: {
                      value: 5,
                      message: "Debe ser mayor a 5, metros cuedrados",
                    },
                    max: {
                      value: 200,
                      menssage: "Deve ser menor a 200, metros cuadrados",
                    },
                  })}
                />
                {errors.metros && (
                  <span className="text-danger small">
                    {errors.metros.message}
                  </span>
                )}
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Características</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="TV, Wi-Fi, Aire acondicionado..."
                  {...register("caracteristicas", {
                    required: "Las características son obligatorias",
                    minLength: {
                      value: 2,
                      message:
                        "Las características debe ser mayor a 2 caracteres",
                    },
                    maxLength: {
                      value: 80,
                      message:
                        "Las características debe ser menor a 80 caracteres",
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
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("descripcion", {
                required: "La descripción es obligatoria",
                minLength: {
                  value: 10,
                  message: "La descripcion debe ser mayor a 10 caracteres",
                },
                maxLength: {
                  value: 500,
                  message: "La descripcion debe ser menor a 500 caracteres",
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
            <Form.Label className="fw-bold">Imagen URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com/foto.jpg"
              {...register("imagen", {
                required: "La URL de la imagen es obligatoria",
                pattern: {
                  value: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                  message: "Debe ser una URL válida (http/https)",
                },
              })}
            />
            {errors.imagen && (
              <span className="text-danger small">{errors.imagen.message}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Estado de la Habitación</Form.Label>
            <div className="d-flex flex-wrap gap-3 p-2 border rounded bg-light">
              {["disponible", "ocupada", "reservada", "mantenimiento"].map(
                (estado) => (
                  <Form.Check
                    type="radio"
                    key={estado}
                    label={estado.charAt(0).toUpperCase() + estado.slice(1)}
                    value={estado}
                    id={`radio-${estado}`}
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

          <div className="d-flex gap-2 justify-content-end">
            <Button variant="danger" onClick={onHide}>
              Cancelar
            </Button>
            <Button variant="dark" type="submit">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditarHabitacion;
