const express = require("express");
// const sequelize = require('./utils/sequerize');
const db_async = require('./models/db_async'); 
const https = require("https");
const http = require("http");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const ip = require("ip");
const bindUser = require("./middleware/bindUser");
const fileUpload = require("express-fileupload");
const RESPONSE_CODES = require("./constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("./constants/RESPONSE_STATUS");
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const habitRoutes = require("./routes/habitRoutes");
const progressRoutes = require("./routes/progressRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

// Middleware to log raw request body for debugging
const logRawBody = (req, res, next) => {
  console.log(`Raw body for ${req.method} ${req.url}:`, req.rawBody);
  next();
};

// Logging middleware to log all incoming requests with body
app.use(express.json({
  verify: rawBodySaver
}));
app.use(express.urlencoded({ extended: true, verify: rawBodySaver }));
app.use(logRawBody);
dotenv.config({ path: path.join(__dirname, "./.env") });

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.all('*', bindUser)
app.use("/auth", authRoutes)
app.use("/goal", goalRoutes)
app.use("/habit", habitRoutes)
app.use("/progress", progressRoutes)
app.use("/user", userRoutes)


app.all("*", (req, res) => {
  res.status(RESPONSE_CODES.NOT_FOUND).json({
    statusCode: RESPONSE_CODES.NOT_FOUND,
    httpStatus: RESPONSE_STATUS.NOT_FOUND,
    message: "Route non trouvé",
    result: [],
  });
});
const port = process.env.PORT || 8000;

app.listen(port, async () => {
  // await db_async.sequelize.sync({ force: true }); 
  console.log(
    `${process.env.NODE_ENV.toUpperCase()} - Server is running on: http://${ip.address()}:${port}/`
  );
});
