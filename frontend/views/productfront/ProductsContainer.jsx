import { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./ProductService";
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

const ProductsContainer = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setCode(editingProduct.code);
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setQuantity(editingProduct.quantity);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setCode("");
    setName("");
    setPrice("");
    setQuantity("");
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!code || !name || !price || !quantity) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    if (isNaN(price) || isNaN(quantity)) {
      Swal.fire("Error", "Precio y Cantidad deben ser numéricos", "warning");
      return;
    }

    const productData = {
      id: editingProduct?.id,
      code,
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    try {
      if (productData.id) {
        await updateProduct(productData.id, productData);
        Swal.fire(
          "Actualizado",
          "Producto actualizado exitosamente",
          "success"
        );
      } else {
        await createProduct(productData);
        Swal.fire("Creado", "Producto creado exitosamente", "success");
      }
      await loadProducts();
      setEditingProduct(null);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id);
      Swal.fire("Eliminado", "Producto eliminado exitosamente", "success");
      await loadProducts();
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
              setEditingProduct(null);
              resetForm();
            }}
          >
            Crear nuevo producto
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
                    label="Código"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                  />
                </Grid>
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
                    label="Precio"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cantidad"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    {editingProduct ? "Actualizar Producto" : "Crear Producto"}
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
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
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
                      onClick={() => handleDelete(product.id)}
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

export default ProductsContainer;
