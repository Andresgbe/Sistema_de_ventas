import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// Función para generar datos de productos
function createProduct(id, name, description, price, quantity) {
  return { id, name, description, price, quantity };
}

// Datos de ejemplo de productos
const products = [
  createProduct(0, "Producto 1", "Descripción del producto 1", 10.99, 50),
  createProduct(1, "Producto 2", "Descripción del producto 2", 19.99, 30),
  createProduct(2, "Producto 3", "Descripción del producto 3", 5.99, 100),
  createProduct(3, "Producto 4", "Descripción del producto 4", 15.99, 20),
  createProduct(4, "Producto 5", "Descripción del producto 5", 12.99, 75),
];

export default function ProductTable() {
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [editForm, setEditForm] = React.useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [openModal, setOpenModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.descripcion,
      price: product.precio,
      quantity: product.cantidad,
    });
    setOpenEditModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    // Aquí puedes implementar la lógica para eliminar el producto
    console.log("Eliminar producto:", selectedProduct);
    setOpenModal(false);
  };

  const handleSaveEdit = () => {
    // Aquí puedes implementar la lógica para guardar los cambios en el producto
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
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Acciones</TableCell> {/* Nueva columna para acciones */}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEdit(product)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(product)}
                >
                  <DeleteIcon />
                </IconButton>
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
            <h2>Eliminar producto</h2>
            <p>¿Estás seguro de que deseas eliminar el producto?</p>
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
            <h2>Editar producto</h2>
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
                label="Descripción"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Precio"
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Cantidad"
                type="number"
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm({ ...editForm, quantity: e.target.value })
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
