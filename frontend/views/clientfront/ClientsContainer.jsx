import { useEffect, useState } from "react";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "./ClientService";
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

/* 
---------------------------------------------------------
Pide los datos del backend (fetchClients),
Muestra el formulario cuando se crea o edita un cliente,
Llama a los métodos: crear, actualizar y eliminar,
Actualiza el estado local de los clientes,
Muestra la tabla ClientsTable y le pasa onEdit y onDelete

Es un componente contenedor.
-----------------------------------------------------------
*/

const ClientsContainer = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (editingClient) {
      setNombre(editingClient.nombre);
      setCedula(editingClient.cedula);
      setTelefono(editingClient.telefono);
      setDireccion(editingClient.direccion);
      setCorreo(editingClient.correo);
    } else {
      setNombre("");
      setCedula("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
    }
  }, [editingClient]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!nombre || !cedula || !telefono || !direccion || !correo) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (!/^[0-9]{7,11}$/.test(telefono)) {
      Swal.fire(
        "Error",
        "El teléfono debe tener entre 7 y 11 dígitos",
        "warning"
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      Swal.fire("Error", "El correo ingresado no es válido", "warning");
      return;
    }

    const clientData = {
      id: editingClient?.id,
      nombre,
      cedula,
      telefono,
      direccion,
      correo,
    };

    try {
      if (clientData.id) {
        await updateClient(clientData.id, clientData);
        Swal.fire("Actualizado", "Cliente actualizado exitosamente", "success");
      } else {
        await createClient(clientData);
        Swal.fire("Creado", "Cliente creado exitosamente", "success");
      }
      await loadClients();
      setEditingClient(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingClient(null);
    setShowForm(false);
    setNombre("");
    setCedula("");
    setTelefono("");
    setDireccion("");
    setCorreo("");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el cliente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteClient(id);
      Swal.fire("Eliminado", "Cliente eliminado exitosamente", "success");
      await loadClients();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!showForm && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
          >
            Crear nuevo cliente
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
                <TableCell>Nombre</TableCell>
                <TableCell>Cédula</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.nombre}</TableCell>
                  <TableCell>{client.cedula}</TableCell>
                  <TableCell>{client.telefono}</TableCell>
                  <TableCell>{client.direccion}</TableCell>
                  <TableCell>{client.correo}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(client)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(client.id)}
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

export default ClientsContainer;
