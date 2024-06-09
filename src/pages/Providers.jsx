import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProvidersTable from "../components/ProvidersTable";
import Dashboard from "../components/Dashboard";

const CreateProviderForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [mail, setMail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, phone, address, mail });
    setName("");
    setPhone("");
    setAddress("");
    setMail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Correo"
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Crear Proveedor
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const Providers = () => {
  const [showForm, setShowForm] = useState(false);
  const [providers, setProviders] = useState([]);

  const handleCreateProvider = (newProvider) => {
    setProviders([...providers, newProvider]);
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
              {showForm ? "Cancelar" : "Crear nuevo proveedor"}
            </Button>
          </Grid>
          {/* Mostrar formulario si showForm es true */}
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateProviderForm onCreate={handleCreateProvider} />
              </Paper>
            </Grid>
          )}
          {/* Tabla de proveedores */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <ProvidersTable providers={providers} />
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Providers;
