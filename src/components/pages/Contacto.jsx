import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

export const Contacto = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Agregar estos estados al inicio de tu componente
  const [mensajeExito, setMensajeExito] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const onSubmit = async (data) => {
    setEnviando(true);
    setError("");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          nombre: data.nombreCompleto,
          email: data.email,
          telefono: data.telefono,
          tipoConsulta: data.tipoConsulta,
          mensaje: data.mensaje,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      Swal.fire({
        title: "¡Mensaje enviado!",
        text: "Gracias por contactarnos. Te responderemos pronto.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#0d6efd",
      });
      reset();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar el mensaje. Intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#dc3545",
      });
      console.error("Error:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container className="my-5">
      {/* Banner */}
      <div
        className="p-4 p-md-5 mb-4 rounded shadow-sm border" // Añadimos 'shadow-sm' y 'border' para elegancia y definición
        style={{
          backgroundColor: "white",
          color: "#152945", // Color de texto oscuro para contraste con fondo blanco
        }}
      >
        <Row className="align-items-center">
          {/* Sección Izquierda: Contáctanos */}
          <Col md={8}>
            <h2 className="fw-bolder mb-3 text-primary">Contáctanos</h2>{" "}
            {/* Usamos text-primary para destacar */}
            <p className="mb-4 text-muted">
              Estamos aquí para ayudarte con reservas, eventos especiales o
              cualquier consulta sobre tu estancia en nuestro hotel.
            </p>
            <div className="d-flex flex-wrap gap-4">
              {/* Mantengo el número de teléfono con el nuevo prefijo */}
              <p className="mb-0 fw-semibold text-secondary">
                Teléfono:{" "}
                <span className="text-decoration-underline text-dark">
                  +54 381 123 4567
                </span>
              </p>
            </div>
          </Col>

          {/* Sección Derecha: Atención Personalizada */}
          <Col
            md={4}
            // Reducimos el margen superior en móvil, mantenemos el borde separador
            className="pt-4 pt-md-0 ps-md-5 border-start border-secondary border-opacity-25"
          >
            <h5 className="fw-bold mb-3 text-dark">Atención personalizada</h5>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Respuesta media</span>
              <span className="fw-semibold text-success">&lt; 2 horas</span>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Horario hoy</span>
              <span className="fw-semibold">09:00 - 22:00</span>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Idioma</span>
              <span className="fw-semibold">ES / EN</span>
            </div>
          </Col>
        </Row>
      </div>

      {/* === 2. CONTENIDO PRINCIPAL: FORMULARIO E INFO === */}
      <Row className="g-4">
        {/* --- Columna Izquierda: Formulario "Envíanos un Mensaje" --- */}
        <Col lg={7}>
          <Card className="shadow-sm border h-100">
            <Card.Body className="p-4 p-md-5">
              <h4 className="fw-bold mb-4">Envíanos un Mensaje</h4>
              <p className="text-muted mb-4">
                Cuéntanos qué necesitas y te responderemos lo antes posible.
              </p>

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Nombre Completo */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Nombre completo *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Escribe tu nombre y apellidos"
                    {...register("nombreCompleto", {
                      required: "El nombre completo es obligatorio",
                      minLength: {
                        value: 3,
                        message:
                          "El nombre completo debe tener al menos 3 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "El nombre completo no puede exceder los 50 caracteres",
                      },
                    })}
                  />
                  {errors.nombreCompleto && (
                    <span className="text-danger">
                      {errors.nombreCompleto.message}
                    </span>
                  )}
                </Form.Group>

                {/* Email y Teléfono */}
                <Row className="mb-3 g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Email *</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        {...register("email", {
                          required: "El email es requerido",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "El email no es válido",
                          },
                        })}
                      />
                      {errors.email && (
                        <span className="text-danger">
                          {errors.email.message}
                        </span>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="+54"
                        {...register("telefono", {
                          required: "El teléfono es requerido",
                          minLength: {
                            value: 10,
                            message:
                              "El teléfono debe tener al menos 10 dígitos",
                          },
                          maxLength: {
                            value: 15,
                            message: "El teléfono no puede exceder 15 dígitos",
                          },
                          pattern: {
                            value: /^[0-9+\-\s()]*$/,
                            message:
                              "El teléfono solo puede contener números y símbolos válidos",
                          },
                        })}
                      />
                      {errors.telefono && (
                        <span className="text-danger">
                          {errors.telefono.message}
                        </span>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Tipo de Consulta */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Tipo de consulta
                  </Form.Label>
                  <Form.Select
                    defaultValue=""
                    {...register("tipoConsulta", {
                      required: "El tipo de consulta es requerido",
                    })}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option>Reserva existente</option>
                    <option>Nueva reserva</option>
                    <option>Eventos y Grupos</option>
                    <option>Información general</option>
                  </Form.Select>
                </Form.Group>

                {/* Mensaje */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Mensaje *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Indícanos detalles de tu reserva, número de personas o cualquier petición especial."
                    {...register("mensaje", {
                      required: "El mensaje es obligatorio",
                      minLength: {
                        value: 10,
                        message: "El mensaje debe tener al menos 10 caracteres",
                      },
                      maxLength: {
                        value: 500,
                        message:
                          "El mensaje no puede exceder los 500 caracteres",
                      },
                    })}
                  />
                  {errors.mensaje && (
                    <span className="text-danger">
                      {errors.mensaje.message}
                    </span>
                  )}
                </Form.Group>

                {/* Botón de Envío */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold py-2"
                  disabled={enviando}
                >
                  {enviando ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Columna Derecha: Información de Contacto --- */}
        <Col lg={5}>
          <Card className="shadow-sm border h-100 p-4">
            <Card.Body>
              <h4 className="fw-bold mb-4">Información de Contacto</h4>

              <div className="d-grid gap-3">
                {/* Dirección */}
                <div className="d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: "#007bff" }}>
                    📍
                  </span>
                  <div>
                    <h6 className="mb-1 fw-semibold">Dirección</h6>
                    <p className="mb-0 text-muted">Tucuman</p>
                  </div>
                </div>

                {/* Teléfono y WhatsApp */}
                <div className="d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: "#007bff" }}>
                    📞
                  </span>
                  <div>
                    <h6 className="mb-1 fw-semibold">Teléfono y WhatsApp</h6>
                    <p className="mb-0 text-muted">Tel: +54 381 123 4567</p>
                  </div>
                </div>

                {/* Email de Reservas */}
                <div className="d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: "#007bff" }}>
                    📧
                  </span>
                  <div>
                    <h6 className="mb-1 fw-semibold">Email de reservas</h6>
                    <p className="mb-0 text-muted">sintaxhotel@gmail.com</p>
                  </div>
                </div>

                {/* Horario de Atención */}
                <div className="d-flex align-items-start">
                  <span className="me-3 fs-5" style={{ color: "#007bff" }}>
                    🕒
                  </span>
                  <div>
                    <h6 className="mb-1 fw-semibold">Horario de atención</h6>
                    <p className="mb-0 text-muted">
                      Lunes a domingo, 09:00 - 22:00
                    </p>
                    <p className="mb-0 small text-success">
                      Respuesta rápida por WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
