import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const UsersTable = ({ onEdit }) => {
  const [users, setUsers] = useState([]);

  // Cargar usuarios desde el backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };
  

  // Función para eliminar un usuario
  const handleDeleteUser = async (id) => {
    try {
      console.log(`Intentando eliminar el usuario con ID: ${id}`);
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      // Actualizar la lista de usuarios después de la eliminación
      setUsers(users.filter((user) => user.id !== id));
      console.log(`Usuario con ID: ${id} eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Cargar los usuarios cuando se monta el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Correo</TableCell>
          <TableCell>Rol</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.address}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <IconButton
                aria-label="edit"
                onClick={() => onEdit(user)} // Llamada a onEdit con el usuario seleccionado
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteUser(user.id)} // Llamada a la función de eliminar
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

export default UsersTable;








