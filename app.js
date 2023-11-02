// app.js

const app = require("./config/express"); // Importa la configuración de Express
const http = require("node:http");
const socketIO = require("socket.io");
const path = require("path");
const usersRoutes = require("./routes/users");
const driversRoutes = require("./routes/drivers");
const tripsRoutes = require("./routes/trips");
const messagesRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth"); // Asegúrate de que esta ruta sea correcta
const express = require("express");
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.static(path.join(__dirname, "public")));
const { chatIO } = require("./sockets/chat");
chatIO(io);
app.use("/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/trips", tripsRoutes(io));
app.use("/api/messages", messagesRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the ride-sharing application!");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
