import { Table } from "react-bootstrap";
import UserRow from "./UserRow";

const UserTable = ({ usuarios, onUsuarioEliminado }) => {
  return (
    <Table hover responsive className="align-middle">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Email</th>
          <th>Rol</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <UserRow
            key={u._id}
            usuario={u}
            onUsuarioEliminado={onUsuarioEliminado}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;

