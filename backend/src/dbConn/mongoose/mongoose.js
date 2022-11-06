const mongoose = require("mongoose");

const connURI = process.env.MONGODB_CLOUD;

/**
 * Connect to MongoDB via Mongoose
 */
mongoose.connect(connURI);

const db = mongoose.connection;

db.on("error", (err) => {
  if (err.message.code === "ETIMEDOUT") {
    // console.log(err);
    mongoose.connect(connURI);
  }
  console.log(err.message);
});

module.exports = { db };
