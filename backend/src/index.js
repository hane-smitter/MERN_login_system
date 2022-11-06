require("dotenv").config();
const express = require("express");
const app = express();

const { db } = require("./dbConn/mongoose/mongoose.js");
const PORT = process.env.PORT || 8000;

app.get("/", function (req, res) {
  res.send("Hello World");
});

// Handling routes not found

app.get("*", function (req, res, next) {
  // Trigger a 404
  // We're not responding here
  next();
});

/* 
app.get("/403", function (req, res, next) {
  // trigger a 403 error
  const err = new Error("not allowed!");
  err.status = 403;
  next(err);
});

app.get("/500", function (req, res, next) {
  // trigger a generic (500) error
  const err = new Error("keyboard cat!");
  next(err);
});
*/

// NoN-Error handling Middleware
app.use(function (req, res, next) {
  res.status(404);

  res.json({ error: "Not found" });
});

// Error handling Middleware
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err?.message });
});

// Connect to DB then start listening on PORT

db.once("open", () => {
  console.log("Database is connected!");
  app.emit("ready");
});
app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
