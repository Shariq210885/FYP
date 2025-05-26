const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const globalErrorHandler = require("./middlewares/globalErrorController");
const router = require("./routers/index");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["POST", "PATCH", "PUT", "GET", "DELETE"],
  })
);
app.use("/upload", express.static(path.join(__dirname, "../upload")));
app.use("/api/", router);
app.use(globalErrorHandler);
module.exports = app;
