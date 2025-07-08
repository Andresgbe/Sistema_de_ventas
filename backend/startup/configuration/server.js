// Importación de módulos principales para levantar el servidor y manejar peticiones HTTP
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./dbConfig.js"; // Configuración y conexión a la base de datos PostgreSQL

// Importación de rutas para cada entidad del sistema
import clientRoutes from "../../logic/clientback/clientController.js";
import providerRoutes from "../../logic/providerback/providerController.js";
import saleRoutes from "../../logic/saleback/saleController.js";
import productRoutes from "../../logic/productback/productController.js";

// Verifica la conexión a la base de datos al iniciar el servidor
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conexión exitosa con PostgreSQL:", res.rows);
  }
});

const app = express(); // Inicializa la aplicación Express

// Middlewares globales para permitir CORS y parsear JSON en las peticiones
app.use(cors());
app.use(bodyParser.json());

// --- RUTAS ---
// Define los endpoints principales del backend, cada uno delega a su respectivo controlador
app.use("/api/clientes", clientRoutes);      // Rutas para gestión de clientes
app.use("/api/proveedores", providerRoutes); // Rutas para gestión de proveedores
app.use("/api/ventas", saleRoutes);          // Rutas para gestión de ventas
app.use("/api/productos", productRoutes);    // Rutas para gestión de productos

// Inicia el servidor en el puerto 5000 y muestra un mensaje en consola
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});

/*
----------------------------------------------------------
Flujo general y uso del archivo:
----------------------------------------------------------
Este archivo es el punto de entrada principal del backend del sistema de ventas.
1. Se encarga de levantar el servidor Express y configurar los middlewares necesarios.
2. Verifica la conexión a la base de datos PostgreSQL usando el archivo dbConfig.js.
3. Importa y monta las rutas principales del sistema (clientes, proveedores, ventas, productos), 
   que se comunican con los controladores ubicados en la carpeta logic.
4. El servidor queda escuchando en el puerto 5000 para recibir peticiones HTTP desde el frontend 
   o herramientas externas (como Postman).
5. Este archivo se utiliza al iniciar el backend, normalmente ejecutando `node server.js` o 
   `npm start` desde la terminal en la carpeta backend/startup/configuration.

Comunicación:
- Se comunica con los controladores de cada entidad (clientController.js, providerController.js, etc.).
- Se comunica con la base de datos a través de dbConfig.js.
- Es consumido por el frontend o cualquier cliente HTTP que haga peticiones a los endpoints definidos.
*/