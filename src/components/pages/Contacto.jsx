import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

export const Contacto = () => {
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

              <Form>
                {/* Nombre Completo */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Nombre completo *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Escribe tu nombre y apellidos"
                  />
                </Form.Group>

                {/* Email y Teléfono */}
                <Row className="mb-3 g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Email *</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Teléfono</Form.Label>
                      <Form.Control type="tel" placeholder="+54" />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Tipo de Consulta */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Tipo de consulta
                  </Form.Label>
                  <Form.Select defaultValue="">
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
                  />
                </Form.Group>

                {/* Botón de Envío */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-bold py-2"
                >
                  Enviar mensaje
                </Button>
              </Form>

              {/* Mensaje de Éxito (solo maquetado, sin lógica) */}
              <div
                className="mt-4 p-2 text-center small"
                style={{ backgroundColor: "#e9f7ef", color: "#155724" }}
              >
                Mensaje enviado correctamente. Gracias por contactar con
                nosotros.
              </div>
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
                    <p className="mb-0 text-muted">
                      Tucuman
                    </p>
                    <a href="#" className="small">
                      Ver en mapa
                    </a>
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

              {/* Mapa (Placeholder) */}
              <div
                className="mt-4 border rounded overflow-hidden"
                style={{ height: "200px", backgroundColor: "#f5f5f5" }}
              >
                <div className="d-flex justify-content-center align-items-center h-100 text-muted small">
                  MAPA DE UBICACIÓN (Placeholder)
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
