import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SalesTable from "../components/SalesTable";
import Dashboard from "../components/Dashboard";
import Autocomplete from "@mui/material/Autocomplete";

const CreateSaleForm = ({ onCreate, editingSale, onCancelEdit }) => {
  const [codigo, setCodigo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clientes");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };
    loadClients();
  }, []);

  useEffect(() => {
    if (editingSale) {
      setCodigo(editingSale.codigo_producto);
      setDescripcion(editingSale.descripcion);
      setCantidad(editingSale.cantidad);
      setTotal(editingSale.total);
    }
  }, [editingSale]);

  // Obtener información del producto por código
  const fetchProductInfo = async (codigo) => {
    if (!codigo) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/productos/${codigo}`
      );
      if (!response.ok) {
        throw new Error("Producto no encontrado");
      }
      const data = await response.json();
      setProductInfo(data);
      setTotal(data.price * cantidad);
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      setProductInfo(null);
      setTotal(0);
    }
  };

  const handleCantidadChange = (e) => {
    const newCantidad = parseInt(e.target.value, 10) || 0;
    setCantidad(newCantidad);
    if (productInfo) {
      setTotal(productInfo.price * newCantidad);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productInfo || !selectedClient) {
      // Validación añadida
      alert("Selecciona un producto y un cliente válido");
      return;
    }

    onCreate({
      codigo_producto: codigo,
      nombre_producto: productInfo.name,
      descripcion,
      cantidad,
      total,
      cliente_id: selectedClient.id,
    });

    setCodigo("");
    setDescripcion("");
    setCantidad("");
    setTotal("");
    setProductInfo(null);
    setSelectedClient(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Código del Producto"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              fetchProductInfo(e.target.value);
            }}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={clients}
            getOptionLabel={(client) => client.nombre}
            value={selectedClient}
            onChange={(_, newValue) => setSelectedClient(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Seleccionar cliente" required />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={handleCantidadChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Total"
            type="number"
            value={total}
            fullWidth
            disabled
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
            onClick={onCancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const Sales = () => {
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/ventas");
      if (!response.ok) {
        throw new Error("Error al cargar las ventas");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleCreateSale = async (newSale) => {
    if (newSale.id) {
      // Actualizar venta
      try {
        const response = await fetch(
          `http://localhost:5000/api/ventas/${newSale.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSale),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar la venta");
        }

        console.log("Venta actualizada exitosamente");
        fetchSales();
        setEditingSale(null);
      } catch (error) {
        console.error("Error al actualizar venta:", error);
      }
    } else {
      // Crear venta
      try {
        const response = await fetch("http://localhost:5000/api/ventas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSale),
        });

        if (!response.ok) {
          throw new Error("Error al agregar la venta al backend");
        }

        console.log("Venta creada exitosamente");
        fetchSales();
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setShowForm(false);
  };

  const handleEditSale = (sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  return (
    <div>
      <Dashboard>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mb: 2 }}>
            {!showForm && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowForm(true);
                  setEditingSale(null);
                }}
              >
                Crear nueva venta
              </Button>
            )}
          </Grid>
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateSaleForm
                  onCreate={handleCreateSale}
                  editingSale={editingSale}
                  onCancelEdit={() => {
                    setEditingSale(null);
                    setShowForm(false);
                  }}
                />
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <div>Cargando ventas...</div>
              ) : (
                <SalesTable sales={sales} onEdit={handleEditSale} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Sales;
