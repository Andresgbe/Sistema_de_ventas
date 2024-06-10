import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import VentasTable from "../components/SalesTable";
import Dashboard from "../components/Dashboard";

const CreateVentaForm = ({ onCreate }) => {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState(0); // Cambio a número
  const [total, setTotal] = useState(0); // Cambio a número

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ codigo, nombre, cantidad, total });
    setCodigo("");
    setNombre("");
    setCantidad(0); // Restablecer a 0
    setTotal(0); // Restablecer a 0
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Total"
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Crear Venta
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const Ventas = () => {
  const [showForm, setShowForm] = useState(false);
  const [ventas, setVentas] = useState([]);

  const handleCreateVenta = (newVenta) => {
    setVentas([...ventas, newVenta]);
    setShowForm(false);
  };

  return (
    <div>
      <Dashboard>
        <Grid container spacing={2}>
          {/* Botón para mostrar/ocultar formulario */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancelar" : "Crear nueva venta"}
            </Button>
          </Grid>
          {/* Mostrar formulario si showForm es true */}
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateVentaForm onCreate={handleCreateVenta} />
              </Paper>
            </Grid>
          )}
          {/* Tabla de ventas */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <VentasTable ventas={ventas} />
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Ventas;
