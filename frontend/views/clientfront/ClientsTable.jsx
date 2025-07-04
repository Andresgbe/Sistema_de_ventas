import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ClientsTable = ({ clients, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Cédula</TableCell>
          <TableCell>Teléfono</TableCell>
          <TableCell>Dirección</TableCell>
          <TableCell>Correo</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>{client.id}</TableCell>
            <TableCell>{client.nombre}</TableCell>
            <TableCell>{client.cedula}</TableCell>
            <TableCell>{client.telefono}</TableCell>
            <TableCell>{client.direccion}</TableCell>
            <TableCell>{client.correo}</TableCell>
            <TableCell>
              <IconButton aria-label="edit" onClick={() => onEdit(client)}>
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => onDelete(client.id)}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
