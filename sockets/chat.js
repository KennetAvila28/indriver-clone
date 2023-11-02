const chatIO=(io) => {
  // const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);
    // Manejar cuando un usuario envía un mensaje
    socket.on('chat message', (message) => {
      // Aquí puedes guardar el mensaje en la base de datos si es necesario
      // Luego, emite el mensaje a todos los usuarios conectados
      console.log(message);
      socket.emit('chat message', message);
    });

    // Manejar cuando un usuario se desconecta
    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
    socket.on("error", (error) => {
        console.error(`Error de Socket.io: ${error.message}`);
      });
  });
};
module.exports = {
  chatIO,
}
