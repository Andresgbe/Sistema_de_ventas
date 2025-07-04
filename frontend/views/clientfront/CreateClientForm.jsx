import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

/*
---------------------------------------------------------
Formulario para crear o editar un cliente.
Recibe las props onCreate, editingClient y onCancelEdit.
Si editingClient está definido, se carga el formulario con los datos del cliente.
Si no, se muestra un formulario vacío.
-----------------------------------------------------------
*/


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
    } else {
      setNombre("");
      setCedula("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
    }
  }, [editingClient]);

  const esTelefonoValido = (tlf) => /^[0-9]{7,11}$/.test(tlf);
  const esCorreoValido = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !cedula || !telefono || !direccion || !correo) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (!esTelefonoValido(telefono)) {
      Swal.fire(
        "Error",
        "El teléfono debe tener entre 7 y 11 dígitos",
        "warning"
      );
      return;
    }

    if (!esCorreoValido(correo)) {
      Swal.fire("Error", "El correo ingresado no es válido", "warning");
      return;
    }

    console.log("Datos del formulario:", {
      nombre,
      cedula,
      telefono,
      direccion,
      correo,
    });
    

    onCreate({
      id: editingClient?.id,
      nombre,
      cedula,
      telefono,
      direccion,
      correo,
    });
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

export default CreateClientForm;
