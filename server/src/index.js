require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { db } = require("./dbConn/mongoose/mongoose.js");
const routes = require("./routes");
const {
  AppErrorHandler,
  LostErrorHandler,
} = require("./config/exceptions/errorHandler.js");
const corsOptions = require("./config/cors/cors.js");

const app = express();
const PORT = process.env.PORT || 8000;

app.disable("x-powered-by");

// Enable Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Parse requests with Content-Type application/json
// so that data is available on req.body
app.use(express.json());

// Parse requests with Cookie header
// so that data is available on req.cookie
app.use(cookieParser());

// Test route
app.get("/", function (req, res) {
  res.send("Hello Welcome to API🙃 !!");
});

// Routes for our application
app.use("/api", routes);

// Fail gracefully for all HTTP Methods when unregistered route
// hits our server
app.all("*", function (req, res, next) {
  // Trigger a 404
  // We're not responding here
  next();
});

// NoN-Error 404 handler Middleware
app.use(LostErrorHandler);

// Error handling Middleware
app.use(AppErrorHandler);

app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});

// Connect to DB then start listening on PORT
db.once("open", () => {
  console.log("---Database is connected !!---");
  app.emit("ready");
});
