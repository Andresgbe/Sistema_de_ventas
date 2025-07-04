import pool from "../../startup/configuration/dbConfig.js";
import Client from "./client.js";

/*
-------------------------------
Se comunica directamente con la base de datos
Contiene funciones asincronas para hacer consultas SQL.
-------------------------------
*/

// !------- Obtener todos los clientes ------------!
export const getAllClients = async () => {
  const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
  return result.rows;
};

// !------- Crear cliente ----------!
export const createClient = async (clientData) => {
  const cliente = new Client(
    clientData.nombre,
    clientData.cedula,
    clientData.telefono,
    clientData.direccion,
    clientData.correo
  );

  const result = await pool.query(
    "INSERT INTO clientes (nombre, cedula, telefono, direccion, correo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      cliente.nombre,
      cliente.cedula,
      cliente.telefono,
      cliente.direccion,
      cliente.correo,
    ]
  );

  return result.rows[0];
};

// !-------- Actualizar cliente -----------!
export const updateClient = async (id, client) => {
  const { nombre, cedula, telefono, direccion, correo } = client;
  const result = await pool.query(
    "UPDATE clientes SET nombre=$1, cedula=$2, telefono=$3, direccion=$4, correo=$5 WHERE id=$6 RETURNING *",
    [nombre, cedula, telefono, direccion, correo, id]
  );
  return result.rows[0];
};

// !-------- Eliminar cliente -----------!
export const deleteClient = async (id) => {
  const ventas = await pool.query(
    "SELECT * FROM ventas WHERE cliente_id = $1",
    [id]
  );
  if (ventas.rows.length > 0) {
    throw new Error(
      "Este cliente tiene ventas asociadas y no puede ser eliminado"
    );
  }

  await pool.query("DELETE FROM clientes WHERE id=$1", [id]);
};
