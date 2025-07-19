import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(`${MONGO_URL}`)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("There was a error connecting to the database", err);
  });

app.get("/", (req, res) => {
  res.send("API is running....");
});
