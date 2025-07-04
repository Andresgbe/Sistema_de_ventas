import pkg from 'pg'; // Importar todo el módulo pg
const { Pool } = pkg; // Extraer Pool

const pool = new Pool({
  user: 'andresgbe',           // Tu usuario de PostgreSQL
  host: 'localhost',           // Servidor local
  database: 'papeleria_unibros', // Nombre de la base de datos
  password: 'yourpassword',    // Contraseña del usuario
  port: 5432,                  // Puerto por defecto de PostgreSQL
});

export default pool;
