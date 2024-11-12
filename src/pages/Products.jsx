import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProductsTable from "../components/ProductsTable";
import Dashboard from "../components/Dashboard";

const CreateProductForm = ({ onCreate }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de los campos del formulario
    if (!code || !name || !price || !quantity) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    onCreate({ code, name, price, quantity });

    // Enviar los datos al backend
    try {
      const response = await fetch("http://localhost:5000/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, name, price, quantity }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar el producto al backend");
      }

      const result = await response.json();
      console.log(result.message); // Mensaje de éxito o confirmación
    } catch (error) {
      console.error("Error:", error);
    }

    // Restablecer los campos del formulario
    setCode("");
    setName("");
    setPrice("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit}>
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
            Crear Producto
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar los productos desde el backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/productos");
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los productos cuando se monta el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = (newProduct) => {
    // Llamar a fetchProducts para obtener la lista actualizada desde el servidor
    fetchProducts();
    setShowForm(false);
  };

  // NUEVA LÍNEA - Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      console.log(`Producto con ID ${id} eliminado exitosamente`); // NUEVA LÍNEA

      // Actualizar la lista de productos
      fetchProducts(); // NUEVA LÍNEA
    } catch (error) {
      console.error("Error al eliminar producto:", error); // NUEVA LÍNEA
    }
  };

  return (
    <div>
      <Dashboard>
        <Grid container spacing={2}>
          {/* Botón para mostrar/ocultar formulario */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancelar" : "Crear nuevo producto"}
            </Button>
          </Grid>
          {/* Mostrar formulario si showForm es true */}
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateProductForm onCreate={handleCreateProduct} />
              </Paper>
            </Grid>
          )}
          {/* Tabla de productos */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <div>Cargando productos...</div>
              ) : (
                <ProductsTable products={products} onDelete={handleDeleteProduct} /> // NUEVA LÍNEA
              )}
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Products;

