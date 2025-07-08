import { useEffect, useState } from "react";
import { fetchSales, createSale, updateSale, deleteSale } from "./SaleService";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { fetchClients } from "../clientfront/ClientService";
import { fetchProductByCode } from "../productfront/ProductService";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

const SalesContainer = () => {
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [codigoProducto, setCodigoProducto] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState("");
  const [precioProducto, setPrecioProducto] = useState(0);

  const [clients, setClients] = useState([]);

  const loadSales = async () => {
    try {
      const data = await fetchSales();
      setSales(data);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
    }
  };

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    loadSales();
    loadClients();
  }, []);

  useEffect(() => {
    if (editingSale) {
      setCodigoProducto(editingSale.codigo_producto);
      setClienteId(editingSale.cliente_id);
      setDescripcion(editingSale.descripcion);
      setCantidad(editingSale.cantidad);
      setTotal(editingSale.total);
    } else {
      resetForm();
    }
  }, [editingSale]);

  const resetForm = () => {
    setCodigoProducto("");
    setClienteId("");
    setDescripcion("");
    setCantidad("");
    setTotal("");
    setPrecioProducto(0);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!codigoProducto || !clienteId || !descripcion || !cantidad) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    const saleData = {
      id: editingSale?.id,
      codigo_producto: codigoProducto,
      cliente_id: clienteId,
      descripcion,
      cantidad,
      total,
    };

    try {
      if (saleData.id) {
        await updateSale(saleData.id, saleData);
        Swal.fire("Actualizado", "Venta actualizada exitosamente", "success");
      } else {
        await createSale(saleData);
        Swal.fire("Creada", "Venta registrada exitosamente", "success");
      }
      await loadSales();
      setEditingSale(null);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error al guardar venta:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSale(null);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la venta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSale(id);
      Swal.fire("Eliminada", "Venta eliminada exitosamente", "success");
      await loadSales();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    if (precioProducto && cantidad) {
      const totalCalculado = (
        parseFloat(precioProducto) * parseFloat(cantidad)
      ).toFixed(2);
      setTotal(totalCalculado);
    } else {
      setTotal("");
    }
  }, [precioProducto, cantidad]);

  const handleCodigoProductoChange = async (e) => {
    const codigo = e.target.value;
    setCodigoProducto(codigo);

    if (codigo) {
      try {
        const product = await fetchProductByCode(codigo);
        const precio = parseFloat(product.price) || 0; // ← CAMBIO AQUÍ
        setPrecioProducto(precio);

        if (cantidad) {
          const totalCalculado = (precio * parseFloat(cantidad)).toFixed(2);
          setTotal(totalCalculado);
        }
      } catch (error) {
        console.error("Error al buscar producto:", error);
        setPrecioProducto(0);
        setTotal("");
      }
    } else {
      setPrecioProducto(0);
      setTotal("");
    }
  };
  

  const handleCantidadChange = (e) => {
    const cant = e.target.value;
    setCantidad(cant);

    if (precioProducto && cant) {
      const totalCalculado = (
        parseFloat(precioProducto) * parseFloat(cant)
      ).toFixed(2);
      setTotal(totalCalculado);
    } else {
      setTotal("");
    }
  };

  useEffect(() => {
    if (precioProducto && cantidad) {
      const totalCalculado = (
        parseFloat(precioProducto) * parseFloat(cantidad)
      ).toFixed(2);
      setTotal(totalCalculado);
    } else {
      setTotal("");
    }
  }, [precioProducto, cantidad]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!showForm && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowForm(true);
              setEditingSale(null);
              resetForm();
            }}
          >
            Crear nueva venta
          </Button>
        )}
      </Grid>

      {showForm && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleCreateOrUpdate}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Código Producto"
                    value={codigoProducto}
                    onChange={handleCodigoProductoChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="cliente-label">Cliente</InputLabel>
                    <Select
                      labelId="cliente-label"
                      label="Cliente"
                      value={clienteId}
                      onChange={(e) => setClienteId(e.target.value)}
                    >
                      {clients.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cantidad"
                    value={cantidad}
                    onChange={handleCantidadChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total"
                    value={total}
                    InputProps={{ readOnly: true }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    {editingSale ? "Actualizar Venta" : "Crear Venta"}
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    color="primary"
                    onClick={handleCancel}
                    style={{ marginLeft: "10px" }}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      )}

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Código Producto</TableCell>
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
                  <TableCell>
                    {clients.find((c) => c.id === sale.cliente_id)?.nombre ||
                      sale.cliente_id}
                  </TableCell>
                  <TableCell>{sale.descripcion}</TableCell>
                  <TableCell>{sale.cantidad}</TableCell>
                  <TableCell>{sale.total}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(sale)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(sale.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SalesContainer;
// This code defines a React component for managing sales, including creating, updating, and deleting sales records.