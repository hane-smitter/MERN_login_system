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

/* 
  1. INITIALIZE EXPRESS APPLICATION 🏁
*/
const app = express();
const PORT = process.env.PORT || 8000;

/* 
  2. APPLICATION MIDDLEWARES AND CUSTOMIZATIONS 🪛
*/
app.disable("x-powered-by");
// Enable Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// Parse requests with Content-Type application/json
// so data is available on req.body
app.use(express.json());
// Parse requests with Cookie header
// so data is available on req.cookie
app.use(cookieParser());

/* 
  3. APPLICATION ROUTES 🛣️
*/
// Test route
app.get("/", function (req, res) {
  res.send("Hello Welcome to API🙃 !!");
});
// modular routes
app.use("/api", routes);

/* 
  4. APPLICATION ERROR HANDLING 🚔
*/
// Handle unregistered route
app.all("*", function (req, res, next) {
  // Forward to `LostErrorHandler`
  next();
});
// 404 error handler middleware
app.use(LostErrorHandler);
// General app error handler
app.use(AppErrorHandler);

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
