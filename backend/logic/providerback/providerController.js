import express from "express";
import {
  getAllProviders as getAll,
  createProvider as create,
  updateProvider as update,
  deleteProvider as remove,
} from "./providerModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const providers = await getAll();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los proveedores" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProvider = await create(req.body);
    res.status(201).json(newProvider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProvider = await update(req.params.id, req.body);
    res.json(updatedProvider);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Proveedor eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
