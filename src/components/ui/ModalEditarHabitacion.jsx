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
      setValue(
        "metrosCuadrados",
        habitacion.metros || habitacion.metrosCuadrados,
      );
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
        metros: Number(data.metrosCuadrados),
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
                  {...register("numero", { required: "Obligatorio" })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Tipo de Habitación</Form.Label>
                <Form.Select {...register("tipo", { required: "Obligatorio" })}>
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
                    required: "Precio obligatorio",
                    min: { value: 0, message: "Mínimo 0" },
                  })}
                />
                <Form.Text className="text-danger">
                  {errors.precio?.message}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Capacidad</Form.Label>
                <Form.Control
                  type="number"
                  {...register("capacidad", { required: "Obligatorio" })}
                />
                <Form.Text className="text-danger">
                  {errors.capacidad?.message}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Piso</Form.Label>
                <Form.Control
                  type="number"
                  {...register("piso", { required: "Obligatorio" })}
                />
                <Form.Text className="text-danger">
                  {errors.piso?.message}
                </Form.Text>
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
                  {...register("metrosCuadrados", {
                    required: "Obligatorio",
                    min: { value: 5, message: "Mínimo 5" },
                  })}
                />
                <Form.Text className="text-danger">
                  {errors.metrosCuadrados?.message}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Características</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="TV, Wi-Fi, Aire acondicionado..."
                  {...register("caracteristicas", { required: true })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              {...register("descripcion", { required: true })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Imagen URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com/foto.jpg"
              {...register("imagen", { required: "La URL es obligatoria" })}
            />
            <Form.Text className="text-danger">
              {errors.imagen?.message}
            </Form.Text>
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
                    {...register("estado", { required: true })}
                  />
                ),
              )}
            </div>
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
