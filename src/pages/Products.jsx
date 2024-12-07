import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ProductsTable from "../components/ProductsTable";
import Dashboard from "../components/Dashboard";

const CreateProductForm = ({ onCreate, editingProduct, onCancelEdit }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => { 
    if (editingProduct) {
      setCode(editingProduct.code);
      setName(editingProduct.name);
      setPrice(editingProduct.price);
      setQuantity(editingProduct.quantity);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de los campos del formulario
    if (!code || !name || !price || !quantity) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (editingProduct) { 
      onCreate({ id: editingProduct.id, code, name, price, quantity });
    } else {
      onCreate({ code, name, price, quantity });
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
            {editingProduct ? "Actualizar Producto" : "Crear Producto"} 
          </Button>
          {editingProduct && ( 
            <Button
              type="button"
              variant="text"
              color="secondary"
              onClick={onCancelEdit}
            >
              Cancelar
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (newProduct) => {
    if (newProduct.id) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/productos/${newProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el producto");
        }

        console.log("Producto actualizado exitosamente");
        fetchProducts();
        setEditingProduct(null);
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    } else {
      // Lógica existente para crear producto
      try {
        const response = await fetch("http://localhost:5000/api/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          throw new Error("Error al agregar el producto al backend");
        }

        console.log("Producto creado exitosamente");
        fetchProducts();
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setShowForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div>
      <Dashboard>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowForm(!showForm);
                setEditingProduct(null); 
              }}
            >
              {showForm ? "Cancelar" : "Crear nuevo producto"}
            </Button>
          </Grid>
          {showForm && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <CreateProductForm
                  onCreate={handleCreateProduct}
                  editingProduct={editingProduct} 
                  onCancelEdit={() => {
                    setEditingProduct(null); 
                    setShowForm(false);
                  }}
                />
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {loading ? (
                <div>Cargando productos...</div>
              ) : (
                <ProductsTable
                products={products}
                onEdit={handleEditProduct} 
              />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Dashboard>
    </div>
  );
};

export default Products;


