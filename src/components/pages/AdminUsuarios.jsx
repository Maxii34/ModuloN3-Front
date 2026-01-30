import { Container, Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import UserTable from "./usuarios/UserTable";
import { listarUsuarios } from "../../services/usuariosAPI";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    search: "",
    rol: "Todos",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUsuarioEliminado = (id) => {
    setUsuarios((prev) => prev.filter((u) => u._id !== id));
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchSearch =
      `${u.nombre} ${u.apellido} ${u.email}`
        .toLowerCase()
        .includes(filtros.search.toLowerCase());

    const matchRol =
      filtros.rol === "Todos" || u.tipo === filtros.rol;

    return matchSearch && matchRol;
  });

  return (
    <Container className="p-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-1">Administración de Usuarios</h2>
          <p className="text-muted mb-0">
            Controlá los usuarios del sistema
          </p>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={6}>
          <Form.Control
            placeholder="Buscar por nombre o email..."
            value={filtros.search}
            onChange={(e) =>
              setFiltros({ ...filtros, search: e.target.value })
            }
          />
        </Col>

        <Col md={3}>
          <Form.Select
            value={filtros.rol}
            onChange={(e) =>
              setFiltros({ ...filtros, rol: e.target.value })
            }
          >
            <option value="Todos">Rol: Todos</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
          </Form.Select>
        </Col>
      </Row>

      <UserTable
        usuarios={usuariosFiltrados}
        onUsuarioEliminado={handleUsuarioEliminado}
      />
    </Container>
  );
};

export default AdminUsuarios;
