require("dotenv").config();
const express = require("express");
const app = express();

const { db } = require("./dbConn/mongoose/mongoose.js");
const router = require("./routes/routes.js");
const {
  AppErrorHandler,
  LostErrorHandler,
} = require("./errors/errorHandler.js");
const PORT = process.env.PORT || 8000;

// Parse requests with Content-Type application/json
// so that data is available on req body
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello Welcome to API !!");
});

// Routes for our application
app.use("/api", router);

// Fail gracefully request for routes not supported by the server
// on all http methods
app.all("*", function (req, res, next) {
  // Trigger a 404
  // We're not responding here
  next();
});

// NoN-Error handling Middleware
app.use(LostErrorHandler);

// Error handling Middleware
app.use(AppErrorHandler);

// Connect to DB then start listening on PORT
db.once("open", () => {
  console.log("Database is connected !!");
  app.emit("ready");
});
app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
