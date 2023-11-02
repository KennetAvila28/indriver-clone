// models/user.js

// Define the User model
class User {
    constructor(id, name, email, password, type, available) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.type = type; // 'Passenger' or 'Driver'
      this.available = available;
    }
  }
  
  module.exports = User;
  