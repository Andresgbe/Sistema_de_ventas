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

// Endpoint para eliminar un producto
app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Intentando eliminar producto con ID: ${id}`); // NUEVO: Log para ver el ID que llega

  const productIndex = productos.findIndex((product) => product.id === parseInt(id));
  
  if (productIndex !== -1) {
    productos.splice(productIndex, 1);
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  } else {
    console.error(`Producto con ID: ${id} no encontrado`); // NUEVO: Log si el producto no es encontrado
    res.status(404).json({ message: "Producto no encontrado" });
  }
});


// NUEVA LÍNEA - Endpoint para editar un producto existente
app.put("/api/productos/:id", (req, res) => {  // NUEVA LÍNEA
  const { id } = req.params;  // NUEVA LÍNEA
  const { code, name, price, quantity } = req.body;  // NUEVA LÍNEA
  const productIndex = productos.findIndex(product => product.id === parseInt(id));  // NUEVA LÍNEA

  if (productIndex !== -1) {  // NUEVA LÍNEA
    // Actualizar los datos del producto  // NUEVA LÍNEA
    productos[productIndex] = {  // NUEVA LÍNEA
      id: productos[productIndex].id,  // NUEVA LÍNEA
      code,  // NUEVA LÍNEA
      name,  // NUEVA LÍNEA
      price,  // NUEVA LÍNEA
      quantity  // NUEVA LÍNEA
    };  // NUEVA LÍNEA
    res.json({ message: "Producto actualizado exitosamente", product: productos[productIndex] });  // NUEVA LÍNEA
  } else {  // NUEVA LÍNEA
    res.status(404).json({ message: "Producto no encontrado" });  // NUEVA LÍNEA
  }  // NUEVA LÍNEA
});  // NUEVA LÍNEA

// Iniciar el servidor en el puerto 5000
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
