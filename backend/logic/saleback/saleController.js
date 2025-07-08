import express from "express";
import {
  getAllSales as getAll,
  createSale as create,
  updateSale as update,
  deleteSale as remove,
} from "./saleModel.js";

const router = express.Router();

// GET /api/ventas
router.get("/", async (req, res) => {
  try {
    const sales = await getAll();
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las ventas" });
  }
});

// POST /api/ventas
router.post("/", async (req, res) => {
  try {
    const newSale = await create(req.body);
    res.status(201).json(newSale);
  } catch (err) {
    console.error("❌ Error al crear venta:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/ventas/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedSale = await update(id, req.body);
    res.json(updatedSale);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Error al actualizar la venta" });
  }
});

// DELETE /api/ventas/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await remove(id);
    res.json({ message: "Venta eliminada" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
