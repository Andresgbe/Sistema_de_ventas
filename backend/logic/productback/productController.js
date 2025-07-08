import express from "express";
import {
  getAllProducts as getAll,
  createProduct as create,
  updateProduct as update,
  deleteProduct as remove,
  getProductByCode,
} from "./productModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await update(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await remove(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const result = await getProductByCode(code);
    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
