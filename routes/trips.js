const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Importa la conexión a la base de datos
// const socketIO = require('socket.io');
// Ruta para obtener una lista de viajes
const tripsRoutes =(io)=>{
  router.get('/', (req, res) => {
    const query = 'SELECT * FROM Trips';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
      } else {
        res.json(results);
      }
    });
  });
  
  // Ruta para obtener un viaje por ID
  router.get('/:id', (req, res) => {
    const tripId = req.params.id;
    const query = 'SELECT * FROM Trips WHERE ID = ?';
    db.query(query, [tripId], (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Viaje no encontrado' });
      } else {
        res.json(results[0]);
      }
    });
  });
  
  // Ruta para crear un nuevo viaje
  // router.post('/', (req, res) => {
  //   const { origin, destination, fare } = req.body;
  //   const query = 'INSERT INTO Trips (Origin, Destination, Fare) VALUES (?, ?, ?)';
  //   db.query(query, [origin, destination, fare], (error, results) => {
  //     if (error) {
  //       console.error('Error al insertar en la base de datos: ' + error.message);
  //       res.status(500).json({ error: 'Error al insertar en la base de datos' });
  //     } else {
  //       res.json({ message: 'Viaje creado exitosamente' });
  //     }
  //   });
  // });
  
  // Ruta para actualizar un viaje por ID
  router.put('/:id', (req, res) => {
    const tripId = req.params.id;
    const { origin, destination, fare } = req.body;
    const query = 'UPDATE Trips SET Origin = ?, Destination = ?, Fare = ? WHERE ID = ?';
    db.query(query, [origin, destination, fare, tripId], (error, results) => {
      if (error) {
        console.error('Error al actualizar en la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al actualizar en la base de datos' });
      } else {
        res.json({ message: 'Viaje actualizado exitosamente' });
      }
    });
  });
  
  // Ruta para eliminar un viaje por ID
  router.delete('/:id', (req, res) => {
    const tripId = req.params.id;
    const query = 'DELETE FROM Trips WHERE ID = ?';
    db.query(query, [tripId], (error, results) => {
      if (error) {
        console.error('Error al eliminar de la base de datos: ' + error.message);
        res.status(500).json({ error: 'Error al eliminar de la base de datos' });
      } else {
        res.json({ message: 'Viaje eliminado exitosamente' });
      }
    });
  });
  // Ruta para solicitar un nuevo viaje
  router.post('/request', (req, res) => {
    const { passengerId, origin, destination, fare, status } = req.body;
  
    // Crea una nueva entrada de viaje en la base de datos
    const createTripQuery = 'INSERT INTO Trips (PassengerID, Origin, Destination, Fare, Status) VALUES (?, ?, ?, ?, ?)';
    db.query(createTripQuery, [passengerId, origin, destination, fare, status ], (error, result) => {
      if (error) {
        console.error('Error al crear el viaje: ' + error.message);
        res.status(500).json({ error: 'Error al crear el viaje' });
      } else {
        const tripId = result.insertId;
        // Notificar a los conductores disponibles sobre el nuevo viaje (utilizando WebSockets)
        try {
          io.emit("newTripRequest",{passengerId, origin, destination, fare,tripId} )
         
        } catch (error) {
          throw error
        }
  
        res.json({ message: 'Viaje solicitado exitosamente', tripId });
      }
    });
  });
  
  // Ruta para que un conductor acepte un viaje
  router.post('/accept/:tripId', (req, res) => {
    const tripId = req.params.tripId;
    const driverId = req.body.driverId;
  
    // Actualiza el viaje en la base de datos para asociarlo con el conductor
    const acceptTripQuery = 'UPDATE Trips SET DriverID = ?, Status= ? WHERE ID = ?';
    db.query(acceptTripQuery, [driverId,'Accepted', tripId], (error) => {
      if (error) {
        console.error('Error al aceptar el viaje: ' + error.message);
        res.status(500).json({ error: 'Error al aceptar el viaje' });
      } else {
      
        io.emit('tripAccepted', { driverId });
  
        res.json({ message: 'Viaje aceptado exitosamente' });
      }
    });
  });
  
  // Ruta para que un conductor rechace un viaje
  router.post('/reject/:tripId', (req, res) => {
    const tripId = req.params.tripId;
  
    // Actualiza el viaje en la base de datos para indicar que fue rechazado
    const rejectTripQuery = 'UPDATE Trips SET DriverID = NULL WHERE ID = ?';
    db.query(rejectTripQuery, [tripId], (error) => {
      if (error) {
        console.error('Error al rechazar el viaje: ' + error.message);
        res.status(500).json({ error: 'Error al rechazar el viaje' });
      } else {
        // Notificar al pasajero que su viaje ha sido rechazado
        io.emit('tripRejected', tripId);
  
        res.json({ message: 'Viaje rechazado exitosamente' });
      }
    });
  });
  return router
}


module.exports = tripsRoutes;
