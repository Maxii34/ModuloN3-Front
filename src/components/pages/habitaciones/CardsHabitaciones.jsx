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

            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Title>Habitación {hab.numero}</Card.Title>
                <span
                  className={`fw-bold ${
                    hab.estado?.toLowerCase() === "disponible"
                      ? "text-success"
                      : hab.estado?.toLowerCase() === "ocupada"
                      ? "text-danger"
                      : "text-warning"
                  }`}
                >
                  {hab.estado}
                </span>
              </div>
              <Card.Text className="text-capitalize">{hab.tipo}</Card.Text>
              <Card.Text className="fw-bold">${hab.precio} / noche</Card.Text>
            </Card.Body>

            <Card.Footer className="d-flex justify-content-between bg-white border-top-0 pb-3 gap-1">
              <Button
                variant="primary"
                className="btn-room"
                onClick={() => onEditarHabitacion(hab)}
              >
                <i className="bi bi-pencil-fill"></i> Editar
              </Button>

              <Button
                variant="danger"
                className="btn-room"
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
