import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importar el middleware CORS

const app = express();

// Utilizar CORS para permitir solicitudes desde otros orígenes
app.use(cors());

app.use(bodyParser.json());

let productos = []; // Lista de productos

// Obtener todos los productos
app.get("/api/productos", (req, res) => {
  res.json(productos);
});

// Agregar un nuevo producto
app.post("/api/productos", (req, res) => {
  const { code, name, price, quantity } = req.body;
  const newProduct = { id: productos.length + 1, code, name, price, quantity };
  productos.push(newProduct);
  res.status(201).json({ message: "Producto agregado exitosamente", product: newProduct });
});

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
