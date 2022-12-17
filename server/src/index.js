require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {
  AppErrorHandler,
  LostErrorHandler,
} = require("./config/exceptions/errorHandler.js");
const routes = require("./routes");
const { db } = require("./dbConn/mongoose/mongoose.js");
const corsOptions = require("./config/cors/cors.js");

/* 
  1. INITIALIZE EXPRESS APPLICATION 🏁
*/
const app = express();
const PORT = process.env.PORT || 8000;

/* 
  2. APPLICATION MIDDLEWARES AND CUSTOMIZATIONS 🪛
*/
app.disable("x-powered-by"); // Disable X-Powered-By header in responses
app.use(express.json()); // Parse requests with Content-Type application/json
app.use(cookieParser()); // Parse requests with Cookie header
app.use(cors(corsOptions)); // Enable Cross Origin Resource Sharing
app.options("*", cors(corsOptions));

/* 
  3. APPLICATION ROUTES 🛣️
*/
// Test route
app.get("/", function (req, res) {
  res.send("Hello Welcome to API🙃 !!");
});
app.use("/api", routes); // modular routes

/* 
  4. APPLICATION ERROR HANDLING 🚔
*/
// Handle unregistered route
app.all("*", function (req, res, next) {
  // Forward to next closest middleware
  next();
});
app.use(LostErrorHandler); // 404 error handler middleware
app.use(AppErrorHandler); // General app error handler

/* 
  5. APPLICATION BOOT UP 🖥️
*/
db.once("open", () => {
  console.log("---Database is connected !!---");
  app.emit("ready");
});
app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
