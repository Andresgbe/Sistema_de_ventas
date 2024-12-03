import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './dbConfig.js'; // Importa la conexión a PostgreSQL
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 

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

// --- RUTAS PARA EL INICIO DE SESIÓN ---

import jwt from 'jsonwebtoken'; // AEGB: Para generar y verificar tokens JWT
import bcrypt from 'bcrypt'; // AEGB: Para cifrar y verificar contraseñas

// Ruta de inicio de sesión
app.post('/api/auth/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar por correo
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      'SECRET_KEY', // clave segura
      { expiresIn: '1h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
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
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los proveedores' });
  }
});

// Agregar un proveedor nuevo
app.post('/api/proveedores', async (req, res) => {
  const { nombre, telefono, direccion, correo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO proveedores (nombre, telefono, direccion, correo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, telefono, direccion, correo]
    );
    res.status(201).json({ message: 'Proveedor agregado exitosamente', proveedor: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar el proveedor' });
  }
});

// Actualizar un proveedor
app.put('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, direccion, correo } = req.body;
  try {
    const result = await pool.query(
      'UPDATE proveedores SET nombre = $1, telefono = $2, direccion = $3, correo = $4 WHERE id = $5 RETURNING *',
      [nombre, telefono, direccion, correo, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    } else {
      res.json({ message: 'Proveedor actualizado exitosamente', proveedor: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el proveedor' });
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


// Iniciar el servidor
app.listen(5000, () => {
  console.log("Servidor corriendo en http://localhost:5000");
});
