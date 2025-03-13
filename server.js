import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './dbConfig.js'; // Importa la conexión a PostgreSQL
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
// import { userSetter } from 'core-js/fn/symbol';

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar con la base de datos:", err);
  } else {
    console.log("Conexión exitosa con PostgreSQL:", res.rows);
  }
});

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- RUTAS PARA USUARIOS ---

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Eliminar un usuario
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Ruta para agregar usuarios
app.post('/api/users', async (req, res) => {
  const { name, address, password, role } = req.body;

  if (!name || !address || !password || !role) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const roleId = roleResult.rows[0].id;

    await pool.query(
      'INSERT INTO usuarios (name, address, password, role, role_id) VALUES ($1, $2, $3, $4, $5)',
      [name, address, hashedPassword, role, roleId]
    );

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const verifyRole = (requiredRole) => {
  return async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    try {
      const decoded = jwt.verify(token, 'secreto');
      const userResult = await pool.query(
        'SELECT r.name as role FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.id = $1',
        [decoded.userId]
      );

      if (userResult.rows[0]?.role !== requiredRole) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      next();
    } catch (err) {
      console.error('Error al verificar el role:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

app.get('/api/admin-only', verifyRole('admin'), (req, res) => {
  res.json({ message: 'Solo para administradores' });
});

// --- RUTAS PARA EL INICIO DE SESIÓN ---

// Ruta de inicio de sesión
app.post('/api/auth/login', async (req, res) => {
  const { address, password } = req.body;

  try {
    // Buscar por correo
    const result = await pool.query('SELECT * FROM usuarios WHERE address = $1', [address]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      'SECRET_KEY', // clave segura
      { expiresIn: '1h' }
    );

    res.json({ token, usuario: { id: usuario.id, name: usuario.name, role: usuario.role } });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// --- RUTAS PARA PRODUCTOS ---

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Agregar un producto nuevo
app.post('/api/productos', async (req, res) => {
  const { code, name, price, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO productos (code, name, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [code, name, price, quantity]
    );
    res.status(201).json({ message: 'Producto agregado exitosamente', product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { code, name, price, quantity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE productos SET code = $1, name = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
      [code, name, price, quantity, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto actualizado exitosamente', product: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// --- RUTAS PARA PROVEEDORES ---

// Obtener todos los proveedores
app.get("/api/proveedores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proveedores");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener los proveedores", err);
    res.status(500).json({ error: "Error al obtener los proveedores" });
  }
});

// Agregar un proveedor nuevo
app.post("/api/proveedores", async (req, res) => {
  const { nombre, telefono, direccion, correo } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO proveedores (nombre, telefono, direccion, correo) VALUES ($1, $2, $3, $4) RETURNING *",
      [nombre, telefono, direccion, correo]
    );
    res
      .status(201)
      .json({
        message: "Proveedor agregado exitosamente",
        provider: result.rows[0],
      });
  } catch (err) {
    console.error("Error al agregar el proveedor:", err);
    res
      .status(500)
      .json({ error: "Error al agregar el proveedor", detalle: err.message });
  }
});
  
// Actualizar un proveedor
app.put("/api/proveedores/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, direccion, correo } = req.body;

  console.log(`Recibiendo actualización para ID: ${id}`);

  try {
    const result = await pool.query(
      "UPDATE proveedores SET nombre = $1, telefono = $2, direccion = $3, correo = $4 WHERE id = $5 RETURNING *",
      [nombre, telefono, direccion, correo, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    res.json({ message: "Proveedor actualizado", provider: result.rows[0] });
  } catch (err) {
    console.error("Error al actualizar el proveedor:", err);
    res
      .status(500)
      .json({
        error: "Error al actualizar el proveedor",
        detalle: err.message,
      });
  }
});


// Eliminar un proveedor
app.delete('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM proveedores WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    } else {
      res.json({ message: 'Proveedor eliminado exitosamente' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});

// -- RUTAS PARA LAS VENTAS -- 
// Obtener todas las ventas
app.get("/api/ventas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ventas ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// Registrar una nueva venta
app.post("/api/ventas", async (req, res) => {
  const {
    producto_id,
    codigo_producto,
    nombre_producto,
    descripcion,
    cantidad,
    total,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ventas (producto_id, codigo_producto, nombre_producto, descripcion, cantidad, total)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        producto_id,
        codigo_producto,
        nombre_producto,
        descripcion,
        cantidad,
        total,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.detail || "Error en el servidor");
  }
});

// Eliminar una venta
app.delete("/api/ventas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM ventas WHERE id = $1", [id]);
    res.send("Venta eliminada correctamente");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});



// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
