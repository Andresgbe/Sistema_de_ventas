import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const handlePrintInvoice = (sale) => {
  const facturaHtml = `
    <html>
      <head>
        <title>Factura #${sale.id}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h2>Factura de Venta #${sale.id}</h2>
        <p><strong>Cliente:</strong> ${sale.cliente_nombre}</p>
        <p><strong>Producto:</strong> ${sale.nombre_producto} (${
    sale.codigo_producto
  })</p>
        <p><strong>Descripción:</strong> ${sale.descripcion}</p>
        <p><strong>Cantidad:</strong> ${sale.cantidad}</p>
        <p><strong>Total:</strong> $${sale.total}</p>
        <p><strong>Fecha:</strong> ${new Date(sale.fecha).toLocaleDateString(
          "es-VE",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}</p>
        <br><br>
        <p>Gracias por su compra.</p>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(facturaHtml);
  printWindow.document.close();
};


const SalesTable = ({ onEdit }) => {
  const [sales, setSales] = useState([]);

  // Cargar las ventas desde el backend
  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ventas");
      if (!response.ok) {
        throw new Error("Error al cargar las ventas");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    }
  };

  // Eliminar una venta
  const handleDeleteSale = async (id) => {
    try {
      console.log(`Intentando eliminar la venta con ID: ${id}`);
      const response = await fetch(`http://localhost:5000/api/ventas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la venta");
      }

      // Actualizar la lista de ventas después de la eliminación
      setSales(sales.filter((sale) => sale.id !== id));
      console.log(`Venta con ID: ${id} eliminada con éxito`);
    } catch (error) {
      console.error("Error al eliminar venta:", error);
    }
  };

  // Cargar las ventas cuando se monta el componente
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
          <TableCell>Cliente</TableCell>
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
            <TableCell>{sale.cliente_nombre}</TableCell>
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
              <IconButton
                aria-label="print"
                onClick={() => handlePrintInvoice(sale)}
              >
                <ReceiptLongIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SalesTable;
