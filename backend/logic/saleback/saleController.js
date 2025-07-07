import pool from "../../startup/configuration/dbConfig.js";
import Sale from "./sale.js";

export const getAllSales = async () => {
  const result = await pool.query("SELECT * FROM ventas ORDER BY id ASC");
  return result.rows;
};

export const createSale = async (saleData) => {
  const sale = new Sale(
    saleData.codigo_producto,
    saleData.cliente_id,
    saleData.descripcion,
    saleData.cantidad,
    saleData.total
  );

  const result = await pool.query(
    `INSERT INTO ventas 
    (codigo_producto, cliente_id, descripcion, cantidad, total) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      sale.codigo_producto,
      sale.cliente_id,
      sale.descripcion,
      sale.cantidad,
      sale.total,
    ]
  );

  return result.rows[0];
};

export const updateSale = async (id, saleData) => {
  const { codigo_producto, cliente_id, descripcion, cantidad, total } =
    saleData;

  const result = await pool.query(
    `UPDATE ventas 
     SET codigo_producto = $1, cliente_id = $2, descripcion = $3, cantidad = $4, total = $5 
     WHERE id = $6 RETURNING *`,
    [codigo_producto, cliente_id, descripcion, cantidad, total, id]
  );

  return result.rows[0];
};

export const deleteSale = async (id) => {
  await pool.query(`DELETE FROM ventas WHERE id = $1`, [id]);
};
