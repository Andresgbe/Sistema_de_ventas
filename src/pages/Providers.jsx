import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProvidersTable from "../components/ProvidersTable";
import Dashboard from "../components/Dashboard";
import Swal from "sweetalert2";

const CreateProviderForm = ({ onCreate, editingProvider, onCancelEdit }) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    if (editingProvider) {
      setNombre(editingProvider.nombre);
      setTelefono(editingProvider.telefono);
      setDireccion(editingProvider.direccion);
      setCorreo(editingProvider.correo);
    }
  }, [editingProvider]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de los campos del formulario
    if (!nombre || !telefono || !direccion || !correo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Deseas crear este proveedor?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, crear",
          cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;

    if (editingProvider) {
      onCreate({
        id: editingProvider.id,
        nombre,
        telefono,
        direccion,
        correo,
      });
    } else {
      onCreate({ nombre, telefono, direccion, correo });
    }

    // Restablecer los campos del formulario
    setNombre("");
    setTelefono("");
    setDireccion("");
    setCorreo("");

     Swal.fire("¡Éxito!", "El proveedor fue creado exitosamente.", "success");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
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
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {editingProvider ? "Actualizar Proveedor" : "Crear Proveedor"}
          </Button>

          {/* Botón de cancelar */}
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleCreateProvider = async (newProvider) => {
    console.log("Datos recibidos en handleCreateProvider:", newProvider);

    if (newProvider.id) {
      // Actualizar proveedor existente
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
      // Crear nuevo proveedor
      try {
        const response = await fetch("http://localhost:5000/api/proveedores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProvider),
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

    setShowForm(false);
  };

  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
    setShowForm(true);
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
                  editingProvider={editingProvider} // Proveedor en edición (si existe)
                  onCancelEdit={() => {
                    setEditingProvider(null); // Limpiar la edición
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
                <ProvidersTable
                  providers={providers}
                  onEdit={handleEditProvider}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Providers;
