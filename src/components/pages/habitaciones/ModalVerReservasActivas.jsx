import { Button, Modal, Badge } from "react-bootstrap";

export const ModalVerReservasActivas = ({
  show,
  handleClose,
  formatearFecha,
  infoReserva,
}) => {
  if (!infoReserva) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Reserva</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          {infoReserva.tipo === "actual" ? (
            <Badge bg="danger" className="px-3 py-2">
              <i className="bi bi-person-fill me-1"></i> Ocupada actualmente
            </Badge>
          ) : (
            <Badge bg="warning" text="dark" className="px-3 py-2">
              <i className="bi bi-calendar-check me-1"></i> Próxima reserva
              agendada
            </Badge>
          )}
        </div>

        <div className="border rounded p-3 bg-light">
          <div className="mb-2">
            <strong>
              <i className="bi bi-box-arrow-in-right me-2"></i>Check-in:
            </strong>{" "}
            {formatearFecha(infoReserva.reserva.fechaEntrada)}
          </div>
          <div className="mb-2">
            <strong>
              <i className="bi bi-box-arrow-left me-2"></i>Check-out:
            </strong>{" "}
            {formatearFecha(infoReserva.reserva.fechaSalida)}
          </div>
          <div className="mb-0">
            <strong>
              <i className="bi bi-people-fill me-2"></i>Huéspedes:
            </strong>{" "}
            {infoReserva.reserva.cantidadHuespedes}{" "}
            {infoReserva.reserva.cantidadHuespedes === 1
              ? "persona"
              : "personas"}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
