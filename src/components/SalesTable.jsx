import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const SalesTable = ({ onEdit }) => {
  const [sales, setSales] = useState([]);
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Obtener ventas del backend
  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ventas");
      if (!response.ok) {
        throw new Error("Error al obtener ventas");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener información del producto al ingresar el ID
  const fetchProductInfo = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${id}`);
      if (!response.ok) {
        throw new Error("Producto no encontrado");
      }
      const data = await response.json();
      setProductInfo(data);
    } catch (error) {
      console.error(error);
      setProductInfo(null);
    }
  };

  // Manejar la creación de ventas
  const handleCreateSale = async () => {
    if (!productInfo || !quantity || quantity <= 0) {
      alert("Ingrese una cantidad válida y un ID de producto existente");
      return;
    }

    const newSale = {
      producto_id: productId,
      codigo_producto: productInfo.code,
      nombre_producto: productInfo.name,
      descripcion: description,
      cantidad: quantity,
      total: quantity * productInfo.price,
    };

    try {
      const response = await fetch("http://localhost:5000/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      });

      if (!response.ok) {
        throw new Error("Error al registrar la venta");
      }

      alert("Venta registrada exitosamente");
      fetchSales();
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Eliminar una venta
  const handleDeleteSale = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/ventas/${id}`, {
        method: "DELETE",
      });
      setSales(sales.filter((sale) => sale.id !== id));
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Código Producto</TableCell>
            <TableCell>Nombre Producto</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.codigo_producto}</TableCell>
              <TableCell>{sale.nombre_producto}</TableCell>
              <TableCell>{sale.descripcion}</TableCell>
              <TableCell>{sale.cantidad}</TableCell>
              <TableCell>{sale.total}</TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => onEdit(sale)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteSale(sale.id)}
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

export default SalesTable;
