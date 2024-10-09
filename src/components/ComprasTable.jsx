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

// Función para generar datos de compras
function createCompra(id, codigo, nombre, cantidad, total) {
  return { id, codigo, nombre, cantidad, total };
}

// Datos de ejemplo de compras
const compras = [
  createCompra(0, "Compra 1", "Nombre de la Compra 1", 10, 100),
  createCompra(1, "Compra 2", "Nombre de la venta 2", 20, 200),
  createCompra(2, "Compra 3", "Nombre de la venta 3", 30, 300),
  createCompra(3, "Venta 4", "Nombre de la venta 4", 40, 400),
  createCompra(4, "Venta 5", "Nombre de la venta 5", 50, 500),
];

export default function ComprasTable() {
  const [selectedCompra, setSelectedCompra] = React.useState(null);
  const [editForm, setEditForm] = React.useState({
    codigo: "",
    nombre: "",
    cantidad: 0,
    total: 0,
  });
  const [openModal, setOpenModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const handleEdit = (compra) => {
    setSelectedCompra(compra);
    setEditForm({
      codigo: compra.codigo,
      nombre: compra.nombre,
      cantidad: compra.cantidad,
      total: compra.total,
    });
    setOpenEditModal(true);
  };

  const handleDelete = (compra) => {
    setSelectedCompra(compra);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    // Aquí puedes implementar la lógica para eliminar la compra
    console.log("Eliminar compra:", selectedCompra);
    setOpenModal(false);
  };

  const handleSaveEdit = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en la compra
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
            <TableCell>Código</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell> {/* Nueva columna para acciones */}
          </TableRow>
        </TableHead>
        <TableBody>
          {compras.map((compra) => (
            <TableRow key={compra.id}>
              <TableCell>{compra.id}</TableCell>
              <TableCell>{compra.codigo}</TableCell>
              <TableCell>{compra.nombre}</TableCell>
              <TableCell>{compra.cantidad}</TableCell>
              <TableCell>{compra.total}</TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => handleEdit(compra)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(compra)}
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
            <h2>Eliminar compra</h2>
            <p>¿Estás seguro de que deseas eliminar la compra?</p>
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
            <h2>Editar compra</h2>
            <form>
              <TextField
                label="Código"
                value={editForm.codigo}
                onChange={(e) =>
                  setEditForm({ ...editForm, codigo: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nombre"
                value={editForm.nombre}
                onChange={(e) =>
                  setEditForm({ ...editForm, nombre: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Cantidad"
                type="number"
                value={editForm.cantidad}
                onChange={(e) =>
                  setEditForm({ ...editForm, cantidad: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Total"
                type="number"
                value={editForm.total}
                onChange={(e) =>
                  setEditForm({ ...editForm, total: e.target.value })
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