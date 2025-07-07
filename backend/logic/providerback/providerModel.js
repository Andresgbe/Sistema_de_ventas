import pool from "../../startup/configuration/dbConfig.js";
import Provider from "./provider.js";

export const getAllProviders = async () => {
  const result = await pool.query("SELECT * FROM proveedores ORDER BY id ASC");
  return result.rows;
};

export const createProvider = async (providerData) => {
  const provider = new Provider(
    providerData.nombre,
    providerData.telefono,
    providerData.direccion,
    providerData.correo
  );

  const result = await pool.query(
    `INSERT INTO proveedores (nombre, telefono, direccion, correo)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [provider.nombre, provider.telefono, provider.direccion, provider.correo]
  );

  return result.rows[0];
};

export const updateProvider = async (id, providerData) => {
  const { nombre, telefono, direccion, correo } = providerData;

  const result = await pool.query(
    `UPDATE proveedores
     SET nombre = $1, telefono = $2, direccion = $3, correo = $4
     WHERE id = $5 RETURNING *`,
    [nombre, telefono, direccion, correo, id]
  );

  return result.rows[0];
};

export const deleteProvider = async (id) => {
  await pool.query(`DELETE FROM proveedores WHERE id = $1`, [id]);
};
