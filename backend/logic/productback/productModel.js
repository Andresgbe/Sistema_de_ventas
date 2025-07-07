import pool from "../../startup/configuration/dbConfig.js";
import Product from "./product.js";

export const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
  return result.rows;
};

export const createProduct = async (productData) => {
  const producto = new Product(
    productData.code,
    productData.name,
    productData.price,
    productData.quantity
  );

  const result = await pool.query(
    `INSERT INTO productos (code, name, price, quantity) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [producto.code, producto.name, producto.price, producto.quantity]
  );

  return result.rows[0];
};

export const updateProduct = async (id, productData) => {
  const { code, name, price, quantity } = productData;

  const result = await pool.query(
    `UPDATE productos 
     SET code = $1, name = $2, price = $3, quantity = $4 
     WHERE id = $5 RETURNING *`,
    [code, name, price, quantity, id]
  );

  return result.rows[0];
};

export const deleteProduct = async (id) => {
  await pool.query(`DELETE FROM productos WHERE id = $1`, [id]);
};
