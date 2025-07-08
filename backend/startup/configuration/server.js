import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./dbConfig.js";

import clientRoutes from "../../logic/clientback/clientController.js";
import providerRoutes from "../../logic/providerback/providerController.js";
import saleRoutes from "../../logic/saleback/saleController.js";
import productRoutes from "../../logic/productback/productController.js";

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conexión exitosa con PostgreSQL:", res.rows);
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// --- RUTAS ---
app.use("/api/clientes", clientRoutes);
app.use("/api/proveedores", providerRoutes);
app.use("/api/ventas", saleRoutes);
app.use("/api/productos", productRoutes);

app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});