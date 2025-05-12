const app = require("./src/app");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE;
const express = require("express");
const path = require("path");
const _dirname = path.resolve();


const connectDB = async (DB) => {
  try {
    await mongoose.connect(DB);
    console.log("DB connected");
  } catch (error) {
    console.log("Couldn't connect Database");
  }
};

app.listen(port, "0.0.0.0", async () => {
  await connectDB(DB);
  console.log("app is running on port: ", port);
});

app.use(express.static(path.join(_dirname, "../front-end/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "../front-end/dist/index.html"));
});
