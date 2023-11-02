import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const notificationList = document.getElementById("notification-list");

// Conectarse al servidor Socket.io
const socket = io(); // Cambia la URL del servidor si es necesario

// Manejar eventos de conexión
socket.on("connect", () => {
  console.log("Conexión establecida.");
  socket.emit("chat message", { message: "Hello" });
});
// Manejar eventos de cierre
socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    console.log("Desconexión del servidor.");
  } else {
    console.error("Conexión cerrada de manera inesperada");
  }
});

// Manejar mensajes del servidor
socket.on("newTripRequest", (data) => {
  const listItem = document.createElement("li");
  listItem.textContent = `Nuevo viaje disponible: ${data.origin} a ${data.destination}, COSTO ${data.fare}`;
  notificationList.appendChild(listItem);
  showAcceptTripModal(data.origin, data.destination, data.fare, data.tripId);
});
socket.on("tripAccepted", (data) => {
    console.log({data});
  const listItem = document.createElement("li");
  listItem.textContent = `Viaje aceptado por el driver: ${data.driverId}`;
  notificationList.appendChild(listItem);
});
// Manejar errores
socket.on("error", (error) => {
  console.error(`Error de Socket.io: ${error.message}`);
});

function showAcceptTripModal(origin, destination, fare, id) {
  const modal = document.getElementById("acceptTripModal");
  const originElement = document.getElementById("tripOrigin");
  const destinationElement = document.getElementById("tripDestination");
  const dateElement = document.getElementById("tripFare");
  const timeRemainingElement = document.getElementById("timeRemaining");
  const acceptButton = document.getElementById("acceptButton");
  // const timeElement = document.getElementById("tripTime");
  acceptButton.addEventListener("click", async () => await acceptTrip(id));
  originElement.textContent = origin;
  destinationElement.textContent = destination;
  dateElement.textContent = fare;
  // timeElement.textContent = time;

  modal.style.display = "block";
  let timeRemaining = 30; // Tiempo restante en segundos
  timeRemainingElement.textContent = timeRemaining;

  // Actualizar el tiempo restante cada segundo
  const timer = setInterval(() => {
    timeRemaining--;
    timeRemainingElement.textContent = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(timer);

      setTimeout(() => {
        modal.style.display = "none";

        // Agregar lógica para rechazar el viaje después de 30 segundos
      }, 1000); // Esperar 1 segundo para que termine la animación de fadeout
    }
  }, 1000);

  // Agregar lógica para aceptar o contraofertar el viaje aquí
  const acceptTrip = async (id) => {
    const accept = {
      tripId: id,
      driverId: 4,
    };
    await fetch("http://localhost:4000/api/trips/accept/"+id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(accept),
    });
    clearInterval(timer);
    modal.style.display = "none";

  };
}
