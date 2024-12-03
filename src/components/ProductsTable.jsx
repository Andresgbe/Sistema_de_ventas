import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductsTable = ({ onEdit }) => { 
  const [products, setProducts] = useState([]);

  //cargar los productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/productos");
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }; 

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      console.log(`Intentando eliminar el producto con ID: ${id}`); // NUEVO: Log para ver el ID antes de eliminar
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      // Actualizar la lista de productos después de la eliminación
      setProducts(products.filter((product) => product.id !== id));
      console.log(`Producto con ID: ${id} eliminado con éxito`);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  //cargar los productos cuando se monta el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Código</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Precio</TableCell>
          <TableCell>Cantidad</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.code}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>
              <IconButton
                aria-label="edit"
                onClick={() => onEdit(product)} // AEGB: Llamada a onEdit con el producto seleccionado
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteProduct(product.id)} // Conservado sin cambios
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

export default ProductsTable;



