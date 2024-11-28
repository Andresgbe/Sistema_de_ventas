import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './dbConfig.js';

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conexión exitosa con PostgreSQL:", res.rows);
  }
});


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Obtener productos
app.get("/api/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows); // Devuelve los productos
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});


// Obtener proveedores
app.get("/api/proveedores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedores"); // Ejecuta la consulta SQL
    res.json(result.rows); // Devuelve los proveedores como un JSON
  } catch (err) {
    console.error(err); // Registra el error en la consola
    res.status(500).json({ error: "Error al obtener los proveedores" }); // Devuelve un error 500 al cliente
  }
});



// Agregar producto nuevo
app.post("/api/productos", async (req, res) => {
  const { code, name, price, quantity } = req.body;  
  try {
    const result = await pool.query(
      "INSERT INTO productos (code, name, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *",
      [code, name, price, quantity]
    );
    res.status(201).json({ message: "Producto agregado exitosamente", product: result.rows[0] });
  } catch (err) {
    console.error("Error al agregar el producto:", err);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

// Agregar proveedor nuevo
app.post("/api/productos", async (req, res) => {
  const { name, phone, address, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO productos (name, phone, address, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, phone, address, email]
    ); 
    res.status(201).json({ message: "Proveedor agregado exitosamente", product: result.rows[0] });
  } catch (err) {
    console.error("Error al agregar el proveedor", err);
    res.status(500).json({ error: "Error al agregar el proveedor" });
  }
  });


// Editar producto
app.put("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, price, quantity } = req.body;
  try {
    const result = await pool.query(
      "UPDATE productos SET code = $1, name = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *",
      [code, name, price, quantity, id]
    );
    if (result.rowCount > 0) {
      res.json({ message: "Producto actualizado exitosamente", product: result.rows[0] });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Eliminar un producto
app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM productos WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Producto eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
