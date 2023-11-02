// models/message.js

// Define the Message model
class Message {
    constructor(id, tripId, senderId, receiverId, content, timestamp) {
      this.id = id;
      this.tripId = tripId;
      this.senderId = senderId;
      this.receiverId = receiverId;
      this.content = content;
      this.timestamp = timestamp;
    }
  }
  
  module.exports = Message;
  