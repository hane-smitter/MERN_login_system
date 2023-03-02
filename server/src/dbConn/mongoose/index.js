const mongoose = require("mongoose");

// Pull in environment variable
const connURI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.set('bufferCommands', false); // Disable buffering

// Connect to MongoDB and store connection in variable
const db = mongoose.connect(connURI);

db.catch((err) => {
  if (err.message.code === "ETIMEDOUT") {
    console.log(`----${err.message.code}----`);
    // console.log(err);
    mongoose.connect(connURI);
  }
  console.log(`----${err.message}----`);
});

module.exports = db;
