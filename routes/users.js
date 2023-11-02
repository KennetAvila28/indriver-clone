// routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importa la conexión a la base de datos
const bcrypt = require('bcrypt');

// Obtener la lista de usuarios
router.get('/', (req, res) => {
    // En la consulta SQL, selecciona explícitamente las columnas que deseas devolver y omite la columna 'Password'
    const query = 'SELECT ID, Name, Email, Type, Available FROM Users';
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
      } else {
        res.json(results);
      }
    });
  });
  

// Crear un nuevo usuario con contraseña encriptada
router.post('/', (req, res) => {
    const { name, email, password  ,type, available} = req.body;
  
    // Encriptar la contraseña antes de almacenarla en la base de datos
    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        console.error('Error al encriptar la contraseña: ' + error.message);
        res.status(500).json({ error: 'Error al encriptar la contraseña' });
      } else {
        const hashedPassword = hash;
        const query = 'INSERT INTO users (name, email, password, type, available) VALUES (?, ?, ?, ?, ?)';
        
        db.query(query, [name, email, hashedPassword,  type, available], (dbError, results) => {
          if (dbError) {
            console.error('Error al insertar en la base de datos: ' + dbError.message);
            res.status(500).json({ error: 'Error al insertar en la base de datos' });
          } else {
            res.json({ message: 'Usuario creado exitosamente' });
          }
        });
      }
    });
  });
// Obtener un usuario por ID
router.get('/:id', (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la URL
  
    // En la consulta SQL, selecciona explícitamente las columnas que deseas devolver y omite la columna 'Password'
    const query = 'SELECT ID, Name, Email, Type, Available FROM Users WHERE ID = ?';
  
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(results[0]); // Devuelve el usuario encontrado sin la contraseña
      }
    });
  });
  
  // Actualizar un usuario por ID
  router.put('/:id', (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la URL
    const { name, email, password } = req.body;
    const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
  
    db.query(query, [name, email, password, userId], (error, results) => {
      if (error) {
        console.error('Error al actualizar el usuario en la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al actualizar el usuario en la base de datos' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json({ message: 'Usuario actualizado exitosamente' });
      }
    });
  });
  
  // Eliminar un usuario por ID
  router.delete('/:id', (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la URL
    const query = 'DELETE FROM users WHERE id = ?';
  
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error al eliminar el usuario de la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al eliminar el usuario de la base de datos' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json({ message: 'Usuario eliminado exitosamente' });
      }
    });
  });
  

module.exports = router;
