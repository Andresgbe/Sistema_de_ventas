import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ClientsTable from "../components/ClientsTable";
import Dashboard from "../components/Dashboard";
import Swal from "sweetalert2";

const CreateClientForm = ({ onCreate, editingClient, onCancelEdit }) => {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    if (editingClient) {
      setNombre(editingClient.nombre);
      setCedula(editingClient.cedula);
      setTelefono(editingClient.telefono);
      setDireccion(editingClient.direccion);
      setCorreo(editingClient.correo);
    }
  }, [editingClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de los campos del formulario
    if (!nombre || !cedula || !telefono || !direccion || !correo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Deseas crear este cliente?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, crear",
          cancelButtonText: "Cancelar",
        });
    
        if (!result.isConfirmed) return;

    if (editingClient) {
      onCreate({
        id: editingClient.id,
        nombre,
        cedula,
        telefono,
        direccion,
        correo,
      });
    } else {
      onCreate({ nombre, cedula, telefono, direccion, correo });
    }

    // Restablecer los campos del formulario
    setNombre("");
    setCedula("");
    setTelefono("");
    setDireccion("");
    setCorreo("");

        Swal.fire("¡Éxito!", "El cliente fue creado exitosamente.", "success");
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
            label="Cédula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
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
            {editingClient ? "Actualizar Cliente" : "Crear Cliente"}
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

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/clientes");
      if (!response.ok) {
        throw new Error("Error al cargar los clientes");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (newClient) => {
    console.log("Datos recibidos en handleCreateClient:", newClient);

    if (newClient.id) {
      // Actualizar cliente existente
      try {
        const response = await fetch(
          `http://localhost:5000/api/clientes/${newClient.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newClient),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el cliente");
        }

        console.log("Cliente actualizado exitosamente");
        fetchClients();
        setEditingClient(null);
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
      }
    } else {
      // Crear nuevo cliente
      try {
        const response = await fetch("http://localhost:5000/api/clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClient),
        });

        if (!response.ok) {
          throw new Error("Error al agregar el cliente al backend");
        }

        console.log("Cliente creado exitosamente");
        fetchClients();
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setShowForm(false);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  return (
    <div>
      <Dashboard>
        <Grid container spacing={2}>
          {/* Botón para crear un nuevo cliente */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            {!showForm && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowForm(true); // Mostrar el formulario
                  setEditingClient(null); // Limpiar la edición anterior
                }}
              >
                Crear nuevo cliente
              </Button>
            )}
          </Grid>

          {/* Mostrar formulario si showForm es true */}
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateClientForm
                  onCreate={handleCreateClient} // Función para crear o editar cliente
                  editingClient={editingClient} // Cliente en edición (si existe)
                  onCancelEdit={() => {
                    setEditingClient(null); // Limpiar la edición
                    setShowForm(false); // Ocultar el formulario
                  }}
                />
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <div>Cargando clientes...</div>
              ) : (
                <ClientsTable clients={clients} onEdit={handleEditClient} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Clients;
