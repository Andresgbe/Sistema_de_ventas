import React, { useState } from "react";
import { useEffect } from "react"; 
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProvidersTable from "../components/ProvidersTable";
import Dashboard from "../components/Dashboard";

const CreateProviderForm = ({ onCreate, onCancelEdit, editingProvider }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [mail, setMail] = useState("");


    useEffect(() => {
      if (editingProvider) {
        setName(editingProvider.name);
        setPhone(editingProvider.phone);
        setAddress(editingProvider.address);
        setMail(editingProvider.mail);
      }
    }, [editingProvider]);

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
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          fullWidth
        />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {editingProvider ? "Actualizar Proveedor" : "Crear Proveedor"}
          </Button>

          {/*Botón de cancelar*/}
          <Button
            type="button"
            variant="text"
            color="primary"
            onClick={onCancelEdit}
            style={{ marginLeft: "10px" }} // Separación entre botones
          >
            Cancelar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const Providers = () => {
  const [showForm, setShowForm] = useState(false);
  const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProvider, setEditingProvider] = useState(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/proveedores");
      if (!response.ok) {
        throw new Error("Error al cargar los proveedores");
      }
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    } finally {
      setLoading(false); // Se ejecuta SIEMPRE, incluso si hay error
    }
  };


  useEffect(() => {
    fetchProviders();
  }, []);


const handleCreateProvider = async (newProvider) => {
  console.log("Recibido en handleCreateProvider:", newProvider);

  if (newProvider.id) { // Actualización del proveedor
    try {
      const response = await fetch(
        `http://localhost:5000/api/proveedores/${newProvider.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProvider),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el proveedor");
      }

      console.log("Proveedor actualizado exitosamente");
      fetchProviders();
      setEditingProvider(null);
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
    }
  } else {
    // Lógica para crear proveedor
    try {
    const response = await fetch("http://localhost:5000/api/proveedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: newProvider.name,
        telefono: newProvider.phone,
        direccion: newProvider.address,
        correo: newProvider.mail,
      }),
    });
      if (!response.ok) {
        throw new Error("Error al agregar el proveedor al backend");
      }

      console.log("Proveedor creado exitosamente");
      fetchProviders();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  setShowForm(false); // Cerrar formulario después de editar o crear un proveedor
};


    const handleEditProvider = (provider) => {
      setEditingProvider(provider);
      setShowForm(true); //Mostrar form
    };

return (
  <div>
    <Dashboard>
      <Grid container spacing={2}>
        {/* Botón para crear un nuevo proveedor */}
        <Grid item xs={12} sx={{ mb: 2 }}>
          {!showForm && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowForm(true); // Mostrar el formulario
                setEditingProvider(null); // Limpiar la edición anterior
              }}
            >
              Crear nuevo proveedor
            </Button>
          )}
        </Grid>

        {/* Mostrar formulario si showForm es true */}
        {showForm && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <CreateProviderForm
                onCreate={handleCreateProvider} // Función para crear o editar proveedor
                editingProvider={editingProvider} // Proveedor que se edita (si existe)
                onCancelEdit={() => {
                  setEditingProvider(null); // Limpiar el proveedor en edición
                  setShowForm(false); // Ocultar el formulario
                }}
              />
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            {loading ? (
              <div>Cargando proveedores...</div>
            ) : (
              <ProvidersTable providers={providers} onEdit={handleEditProvider} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  </div>
);
};

export default Providers;
