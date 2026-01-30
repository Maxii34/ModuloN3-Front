import { useState } from "react";
import { Button, Modal, Badge, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { eliminarUsuario } from "../../../services/usuariosAPI";

const UserRow = ({ usuario, onUsuarioEliminado }) => {
  const [showModal, setShowModal] = useState(false);
  const [habitacion, setHabitacion] = useState(null);

  const handleEliminar = async () => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${usuario.nombre} ${usuario.apellido}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const usuarioKey = JSON.parse(
        sessionStorage.getItem("usuarioKey")
      );

      await eliminarUsuario(usuario._id, usuarioKey.token);

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El usuario fue eliminado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      onUsuarioEliminado(usuario._id);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo eliminar el usuario",
      });
    }
  };

  const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;

  const handleOpenModal = async () => {
    setShowModal(true);

    if (usuario.habitacionAsignada) {
      try {
        const resp = await fetch(
          `${habitacionesBack}/${usuario.habitacionAsignada}`
        );
        const data = await resp.json();
        setHabitacion(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <tr>
        <td className="d-flex align-items-center gap-2">
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center
            bg-${usuario.tipo === "admin" ? "primary" : "secondary"} text-white`}
            style={{ width: 40, height: 40 }}
          >
            <i className="bi bi-person-fill"></i>
          </div>
          <span className="fw-semibold">
            {usuario.nombre} {usuario.apellido}
          </span>
        </td>

        <td>{usuario.email}</td>

        <td>
          <Badge bg={usuario.tipo === "admin" ? "primary" : "secondary"}>
            {usuario.tipo}
          </Badge>
        </td>

        <td className="text-center">
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={handleOpenModal}
          >
            <i className="bi bi-eye"></i>
          </Button>

          <Button
            variant="outline-danger"
            size="sm"
            disabled={usuario.tipo === "admin"}
            onClick={handleEliminar}
            title={
              usuario.tipo === "admin"
                ? "No se puede eliminar un administrador"
                : "Eliminar usuario"
            }
          >
            <i className="bi bi-trash"></i>
        </Button>
        </td>
      </tr>

      {/* MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Rol:</strong> {usuario.tipo}</p>

          {habitacion && (
            <>
              <hr />
              <h6 className="fw-bold">Habitación Reservada</h6>

              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <strong>
                      Habitación {habitacion.numero}
                    </strong>
                    <Badge bg="primary">{habitacion.tipo}</Badge>
                  </div>
                  <div className="text-muted small mt-2">
                    Precio: ${habitacion.precio}
                  </div>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserRow;
