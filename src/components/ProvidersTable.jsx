import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProvidersTable = ({ onEdit }) => {
  const [providers, setProviders] = useState([]);

  // Cargar proveedores desde el backend
  const fetchProviders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/proveedores");
      if (!response.ok) {
        throw new Error("Error al cargar los proveedores");
      }
      const data = await response.json();
      setProviders(data);    
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }
  };

  // Función para eliminar un proveedor
  const handleDeleteProvider = async (id) => {
    try {
      console.log(`Intentando eliminar el proveedor con ID: ${id}`); // Ajustado el uso de la flecha
      const response = await fetch(`http://localhost:5000/api/proveedores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el proveedor");
      }

      // Actualizar la lista de proveedores después de la eliminación
      setProviders(providers.filter((provider) => provider.id !== id)); // Corrección en lógica de eliminación
      console.log(`Proveedor con ID: ${id} eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
    }
  };

  // Cargar los proveedores cuando se monta el componente
  useEffect(() => {
    fetchProviders(); // Corrección: Se llamó fetchProviders en lugar de fetchProducts
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
        {providers.map((provider) => (
          <TableRow key={provider.id}>
            <TableCell>{provider.id}</TableCell>
            <TableCell>{provider.nombre}</TableCell>
            <TableCell>{provider.telefono}</TableCell>
            <TableCell>{provider.direccion}</TableCell>
            <TableCell>{provider.correo}</TableCell>
            <TableCell>
              <IconButton
                aria-label="edit"
                onClick={() => onEdit(provider)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteProvider(provider.id)} // Corrección: handleDeleteProvider
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

export default ProvidersTable;
