const express = require('express');
const { generateToken } = require('../utils/authentication'); // Importa la función para generar tokens
const db = require('../config/db'); // Importa la conexión a la base de datos
const bcrypt = require('bcrypt'); 
const router = express.Router();

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT ID, Name, Email, Password, Type FROM Users WHERE Email = ?';
    db.query(query, [email], (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos: ' + error.message);
        return res.status(500).json({ error: 'Error al consultar la base de datos' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: 'Credenciales no válidas' });
      }
  
      // Compara la contraseña proporcionada con el hash almacenado en la base de datos
      const user = results[0];
      const storedHashedPassword = user.Password;
  
      bcrypt.compare(password, storedHashedPassword, (bcryptError, passwordMatch) => {
        if (bcryptError || !passwordMatch) {
          return res.status(401).json({ error: 'Credenciales no válidas' });
        }
  
        // Las credenciales son válidas, genera un token JWT
        const userWithoutPassword = { ...user, Password: undefined };
        const token = generateToken(userWithoutPassword);
  
        res.json({ token });
      });
    });
  });

module.exports = router;
