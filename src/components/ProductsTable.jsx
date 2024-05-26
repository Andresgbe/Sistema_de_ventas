import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Función para generar datos de productos
function createProduct(id, name, descripcion, precio, cantidad) {
  return { id, name, descripcion, precio, cantidad };
}

// Datos de ejemplo de productos
const products = [
  createProduct(0, "Producto 1", "Descripción del producto 1", 10.99, 50),
  createProduct(1, "Producto 2", "Descripción del producto 2", 19.99, 30),
  createProduct(2, "Producto 3", "Descripción del producto 3", 5.99, 100),
  createProduct(3, "Producto 4", "Descripción del producto 4", 15.99, 20),
  createProduct(4, "Producto 5", "Descripción del producto 5", 12.99, 75),
];

export default function ProductTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Precio</TableCell>
          <TableCell>Cantidad</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.descripcion}</TableCell>
            <TableCell>{product.precio}</TableCell>
            <TableCell>{product.cantidad}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
