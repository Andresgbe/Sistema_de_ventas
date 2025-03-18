import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ClientsTable = ({ onEdit }) => {
  const [clients, setClients] = useState([]);

  // Cargar clientes desde el backend
  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/clientes");
      if (!response.ok) {
        throw new Error("Error al cargar los clientes");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  // Función para eliminar un cliente
  const handleDeleteClient = async (id) => {
    try {
      console.log(`Intentando eliminar el cliente con ID: ${id}`);
      const response = await fetch(`http://localhost:5000/api/clientes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el cliente");
      }

      // Actualizar la lista de clientes después de la eliminación
      setClients(clients.filter((client) => client.id !== id));
      console.log(`Cliente con ID: ${id} eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  // Cargar los clientes cuando se monta el componente
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
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
            <TableCell>{client.telefono}</TableCell>
            <TableCell>{client.direccion}</TableCell>
            <TableCell>{client.correo}</TableCell>
            <TableCell>
              <IconButton aria-label="edit" onClick={() => onEdit(client)}>
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteClient(client.id)}
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
