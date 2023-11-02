// routes/drivers.js

const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importa la conexión a la base de datos

// Obtiene una lista de conductores
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Drivers';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error al consultar la base de datos: ' + error.message);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } else {
      res.json(results);
    }
  });
});

// Obtiene un conductor por ID
router.get('/:id', (req, res) => {
  const driverId = req.params.id;
  const query = 'SELECT * FROM Drivers WHERE ID = ?';
  db.query(query, [driverId], (error, results) => {
    if (error) {
      console.error('Error al consultar la base de datos: ' + error.message);
      res.status(500).json({ error: 'Error al consultar la base de datos' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Conductor no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
});

// Crea un nuevo conductor
router.post('/', (req, res) => {
  const { model, plate } = req.body;
  const query = 'INSERT INTO Drivers (ModelCoche, PlacaCoche) VALUES (?, ?)';
  db.query(query, [model, plate], (error, results) => {
    if (error) {
      console.error('Error al insertar en la base de datos: ' + error.message);
      res.status(500).json({ error: 'Error al insertar en la base de datos' });
    } else {
      res.json({ message: 'Conductor creado exitosamente' });
    }
  });
});

// Actualiza un conductor por ID
router.put('/:id', (req, res) => {
  const driverId = req.params.id;
  const { model, plate } = req.body;
  const query = 'UPDATE Drivers SET ModelCoche = ?, PlacaCoche = ? WHERE ID = ?';
  db.query(query, [model, plate, driverId], (error, results) => {
    if (error) {
      console.error('Error al actualizar en la base de datos: ' + error.message);
      res.status(500).json({ error: 'Error al actualizar en la base de datos' });
    } else {
      res.json({ message: 'Conductor actualizado exitosamente' });
    }
  });
});

// Elimina un conductor por ID
router.delete('/:id', (req, res) => {
  const driverId = req.params.id;
  const query = 'DELETE FROM Drivers WHERE ID = ?';
  db.query(query, [driverId], (error, results) => {
    if (error) {
      console.error('Error al eliminar de la base de datos: ' + error.message);
      res.status(500).json({ error: 'Error al eliminar de la base de datos' });
    } else {
      res.json({ message: 'Conductor eliminado exitosamente' });
    }
  });
});

module.exports = router;
