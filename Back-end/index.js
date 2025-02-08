const app = require("./src/app");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const DB = process.env.DATABASE;

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