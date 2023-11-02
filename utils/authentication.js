const jwt = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()
const secretKey = process.env.SECRET_KEY; // Cambia esto a una clave segura

// Función para generar un token JWT
function generateToken(user) {
  const payload = {
    id: user.ID,
    name: user.Name,
    email: user.Email,
    type: user.Type,
  };

  const options = {
    expiresIn: '1h', // Cambia esto según tus necesidades de expiración
  };

  return jwt.sign(payload, secretKey, options);
}

// Middleware de autenticación
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token de autorización no proporcionado' });
  }

  jwt.verify(token, secretKey, (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Token no válido' });
    }

    req.user = user; // Agrega el usuario autenticado al objeto de solicitud
    next();
  });
}

module.exports = {
  generateToken,
  authenticateToken,
};
