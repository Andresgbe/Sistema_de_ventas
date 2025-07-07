import { useEffect, useState } from "react";
import {
  fetchProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "./ProviderService";
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

const ProvidersContainer = () => {
  const [providers, setProviders] = useState([]);
  const [editingProvider, setEditingProvider] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");

  const loadProviders = async () => {
    try {
      const data = await fetchProviders();
      setProviders(data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (editingProvider) {
      setNombre(editingProvider.nombre);
      setTelefono(editingProvider.telefono);
      setDireccion(editingProvider.direccion);
      setCorreo(editingProvider.correo);
    } else {
      resetForm();
    }
  }, [editingProvider]);

  const resetForm = () => {
    setNombre("");
    setTelefono("");
    setDireccion("");
    setCorreo("");
  };

  const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const esTelefonoValido = (telefono) => /^[0-9]{7,11}$/.test(telefono);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!nombre || !telefono || !direccion || !correo) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (!esTelefonoValido(telefono)) {
      Swal.fire("Error", "El teléfono no es válido", "warning");
      return;
    }

    if (!esCorreoValido(correo)) {
      Swal.fire("Error", "El correo ingresado no es válido", "warning");
      return;
    }

    const providerData = {
      id: editingProvider?.id,
      nombre,
      telefono,
      direccion,
      correo,
    };

    try {
      if (providerData.id) {
        await updateProvider(providerData.id, providerData);
        Swal.fire(
          "Actualizado",
          "Proveedor actualizado exitosamente",
          "success"
        );
      } else {
        await createProvider(providerData);
        Swal.fire("Creado", "Proveedor creado exitosamente", "success");
      }
      await loadProviders();
      setEditingProvider(null);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProvider(null);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el proveedor.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProvider(id);
      Swal.fire("Eliminado", "Proveedor eliminado exitosamente", "success");
      await loadProviders();
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
            onClick={() => {
              setShowForm(true);
              setEditingProvider(null);
              resetForm();
            }}
          >
            Crear nuevo proveedor
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
                    {editingProvider
                      ? "Actualizar Proveedor"
                      : "Crear Proveedor"}
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
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.id}</TableCell>
                  <TableCell>{provider.nombre}</TableCell>
                  <TableCell>{provider.telefono}</TableCell>
                  <TableCell>{provider.direccion}</TableCell>
                  <TableCell>{provider.correo}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(provider)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(provider.id)}
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

export default ProvidersContainer;
