// Importa express y las funciones del modelo de cliente
import express from "express";
import {
  getAllClients as getAll,
  createClient as create,
  updateClient as update,
  deleteClient as remove,
} from "./clientModel.js";

const router = express.Router(); // Inicializa el router de Express para definir las rutas

// --- RUTAS ---

// Ruta GET para obtener todos los clientes
// Llama a la función getAll del modelo y responde con la lista de clientes
router.get("/", async (req, res) => {
  try {
    const clients = await getAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

// Ruta POST para crear un nuevo cliente
// Llama a la función create del modelo y responde con el cliente creado
router.post("/", async (req, res) => {
  try {
    const newClient = await create(req.body);
    res.status(201).json(newClient);
  } catch (err) {
    console.error("❌ Error al crear cliente:", err.message);
    console.error("📦 Detalle:", err);
    res.status(400).json({ error: err.message });
  }
});

// Ruta PUT para actualizar un cliente existente por su ID
// Llama a la función update del modelo y responde con el cliente actualizado
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedClient = await update(id, req.body);
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el cliente" });
  }
});

// Ruta DELETE para eliminar un cliente por su ID
// Llama a la función remove del modelo y responde con un mensaje de éxito o error
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await remove(id);
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

/*
----------------------------------------------------------
Flujo general y uso del archivo:
----------------------------------------------------------
- Este archivo define el controlador de rutas para la entidad Cliente usando Express.
- Expone rutas HTTP (GET, POST, PUT, DELETE) para gestionar clientes.
- Cada ruta llama a una función del modelo clientModel.js para interactuar con la base de datos.
- Se comunica directamente con el modelo (clientModel.js) y es utilizado por el archivo principal del servidor (server.js).
- Se utiliza cuando el backend recibe peticiones HTTP relacionadas con clientes, ya sea desde el frontend o herramientas externas.
*/
