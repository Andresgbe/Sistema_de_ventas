import express from "express";
import {
  getAllClients as getAll,
  createClient as create,
  updateClient as update,
  deleteClient as remove,
} from "./clientModel.js";

const router = express.Router();

// --- RUTAS ---
router.get("/", async (req, res) => {
  try {
    const clients = await getAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});

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

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedClient = await update(id, req.body);
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar el cliente" });
  }
});

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
