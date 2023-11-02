// models/trip.js

// Define the Trip model
class Trip {
    constructor(id, passengerId, driverId, origin, destination, fare, status) {
      this.id = id;
      this.passengerId = passengerId;
      this.driverId = driverId;
      this.origin = origin;
      this.destination = destination;
      this.fare = fare;
      this.status = status; // 'Pending', 'Accepted', 'Canceled', 'Completed', etc.
    }
  }
  
  module.exports = Trip;
  