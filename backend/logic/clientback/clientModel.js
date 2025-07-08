// Importa la configuración de la base de datos y la clase Client
import pool from "../../startup/configuration/dbConfig.js";
import Client from "./client.js";

/*
-------------------------------
Este archivo implementa el modelo de datos para la entidad Cliente.
- Se comunica directamente con la base de datos PostgreSQL usando el pool de conexiones.
- Contiene funciones asincrónicas para hacer consultas SQL relacionadas con clientes.
- Es utilizado por el controlador clientController.js para realizar operaciones CRUD sobre los clientes.
-------------------------------
*/

// !------- Obtener todos los clientes ------------!
// Recupera todos los clientes de la base de datos.
export const getAllClients = async () => {
  const result = await pool.query("SELECT * FROM clientes ORDER BY id ASC");
  return result.rows;
};

// !------- Crear cliente ----------!
// Crea un nuevo cliente en la base de datos usando los datos recibidos.
export const createClient = async (clientData) => {
  // Se instancia un objeto Client para asegurar la estructura de los datos
  const cliente = new Client(
    clientData.nombre,
    clientData.cedula,
    clientData.telefono,
    clientData.direccion,
    clientData.correo
  );

  // Inserta el nuevo cliente en la base de datos y retorna el registro creado
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
// Actualiza los datos de un cliente existente por su ID.
export const updateClient = async (id, client) => {
  const { nombre, cedula, telefono, direccion, correo } = client;
  const result = await pool.query(
    "UPDATE clientes SET nombre=$1, cedula=$2, telefono=$3, direccion=$4, correo=$5 WHERE id=$6 RETURNING *",
    [nombre, cedula, telefono, direccion, correo, id]
  );
  return result.rows[0];
};

// !-------- Eliminar cliente -----------!
// Elimina un cliente de la base de datos, solo si no tiene ventas asociadas.
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

/*
----------------------------------------------------------
Flujo general y uso del archivo:
----------------------------------------------------------
- Este archivo define funciones para interactuar con la base de datos PostgreSQL: obtener, crear, actualizar y eliminar clientes.
- Se comunica directamente con la base de datos usando el pool de conexiones definido en dbConfig.js.
- Es consumido por el controlador clientController.js, que expone estas funciones como endpoints HTTP.
- Se utiliza en el backend cada vez que se requiere realizar una operación sobre los datos de clientes, ya sea desde el frontend o
*/