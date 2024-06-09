import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material.Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// Función para generar datos de proveedores
function createProvider(id, name, phone, address, mail) {
  return { id, name, phone, address, mail };
}

// Datos de ejemplo de proveedores
const providers = [
  createProvider(
    0,
    "Proveedor 1",
    "Teléfono del proveedor 1",
    "Dirección 1",
    "correo1@example.com"
  ),
  createProvider(
    1,
    "Proveedor 2",
    "Teléfono del proveedor 2",
    "Dirección 2",
    "correo2@example.com"
  ),
  createProvider(
    2,
    "Proveedor 3",
    "Teléfono del proveedor 3",
    "Dirección 3",
    "correo3@example.com"
  ),
  createProvider(
    3,
    "Proveedor 4",
    "Teléfono del proveedor 4",
    "Dirección 4",
    "correo4@example.com"
  ),
  createProvider(
    4,
    "Proveedor 5",
    "Teléfono del proveedor 5",
    "Dirección 5",
    "correo5@example.com"
  ),
];

export default function ProviderTable() {
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  const [editForm, setEditForm] = React.useState({
    name: "",
    phone: "",
    address: "",
    mail: "",
  });
  const [openModal, setOpenModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const handleEdit = (provider) => {
    setSelectedProvider(provider);
    setEditForm({
      name: provider.name,
      phone: provider.phone,
      address: provider.address,
      mail: provider.mail,
    });
    setOpenEditModal(true);
  };

  const handleDelete = (provider) => {
    setSelectedProvider(provider);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    // Aquí puedes implementar la lógica para eliminar el proveedor
    console.log("Eliminar proveedor:", selectedProvider);
    setOpenModal(false);
  };

  const handleSaveEdit = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en el proveedor
    console.log("Guardar cambios:", editForm);
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  return (
    <React.Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Acciones</TableCell> {/* Nueva columna para acciones */}
          </TableRow>
        </TableHead>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>{provider.id}</TableCell>
              <TableCell>{provider.name}</TableCell>
              <TableCell>{provider.phone}</TableCell>
              <TableCell>{provider.address}</TableCell>
              <TableCell>{provider.mail}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(provider)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(provider)}
                ></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Modal para confirmación de eliminación o edición */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <React.Fragment>
            <h2>Eliminar proveedor</h2>
            <p>¿Estás seguro de que deseas eliminar el proveedor?</p>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
            >
              Eliminar
            </Button>
            <Button onClick={handleCloseModal} variant="outlined">
              Cancelar
            </Button>
          </React.Fragment>
        </Box>
      </Modal>
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <React.Fragment>
            <h2>Editar proveedor</h2>
            <form>
              <TextField
                label="Nombre"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Teléfono"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Dirección"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Correo"
                value={editForm.mail}
                onChange={(e) =>
                  setEditForm({ ...editForm, mail: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
              >
                Guardar cambios
              </Button>
              <Button onClick={handleCloseEditModal} variant="outlined">
                Cancelar
              </Button>
            </form>
          </React.Fragment>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
