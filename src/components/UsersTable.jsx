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

// Cargar usuarios
const fetchUsers = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/auth/register");
        if(!response.ok) {
            throw new Error("Error al cargar los productos");
        }
        const data = await response.json();
        setUsers(data);
        
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
};

// Eliminar un usuario
const handleDeleteUser = async(id) => {
    try{
        console.log(`Intentando eliminar usuario con ID ${id}`);
        const response = await fetch(`http://localhost:5000/api/auth/register/${id}`, {
        method: "DELETE",
      });

      if(!response.ok) {
        throw new Error("Error al eliminar un usuario");
      }

      //Actualizar la lista después de eliminar el usuario
      setUsers(users.filter((users) => users.id !== id));
      console.log(`Usuario con ID: ${id} eliminado con éxito`);
    } catch(error){
        console.log("Error al eliminar un usuario:", error);

    }
};

//cargar usuarios cuando al montarse el componente
useEffect(() => {
    fetchUsers();
}, []);

return(
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>ROL</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.code}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.price}</TableCell>
            <TableCell>{user.quantity}</TableCell>
            <TableCell>
              <IconButton
                aria-label="edit"
                onClick={() => onEdit(user)} // Llamada a onEdit con el usuario seleccionado
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteUser(user.id)} // Conservado sin cambios
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

)
};

export default UsersTable;





