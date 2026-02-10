import { Card, Button, Col, Row } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const CardsHabitaciones = ({
  habitaciones,
  borrarHabitacion,
  onEditarHabitacion,
}) => {
  return (
    <Row className="g-4">
      {habitaciones.map((hab) => (
        <Col md={3} key={hab._id || hab.id}>
          <Card className="h-100 shadow-sm card-room">
            <Card.Img
              variant="top"
              src={hab.imagenes || hab.imagen || hab.img}
              style={{ height: "200px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=Sin+Imagen";
              }}
            />

            <Card.Body className="p-2">
              <div
                className="text-uppercase fw-bold text-secondary mb-2"
                style={{ fontSize: "0.8rem", letterSpacing: "2px" }}
              >
                Habitación {hab.numero}
              </div>

              <h3
                className="fw-bold text-capitalize mb-1"
                style={{ color: "#212529" }}
              >
                {hab.tipo}
              </h3>

              {/* 3. Estado: Ahora como una línea divisoria suave que no estorba arriba */}
              <div className="mb-2">
                <span
                  className={`badge rounded-pill px-2 py-1 border ${
                    hab.estado?.toLowerCase() === "disponible"
                      ? "bg-success-subtle text-success border-success"
                      : hab.estado?.toLowerCase() === "ocupada"
                        ? "bg-danger-subtle text-danger border-danger"
                        : "bg-warning-subtle text-warning border-warning"
                  }`}
                  style={{ fontSize: "0.75rem", fontWeight: "700" }}
                >
                  ● {hab.estado}
                </span>
              </div>

              <hr className="my-1 opacity-25" />

              <div className="d-flex align-items-end">
                <span className="h5 fw-bold text-dark mb-0">${hab.precio}</span>
                <span
                  className="text-muted ms-2 mb-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  / noche
                </span>
              </div>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-between bg-white border-top-0 pb-3 gap-1">
              <Button
                variant="primary"
                className="btn-room shadow-lg"
                onClick={() => onEditarHabitacion(hab)}
              >
                <i className="bi bi-pencil-fill"></i> Editar
              </Button>

              <Button
                variant="danger"
                className="btn-room shadow-lg"
                onClick={() => borrarHabitacion(hab._id || hab.id)}
              >
                <i className="bi bi-trash-fill"></i> Eliminar
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardsHabitaciones;
