import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import choreRoutes from "./routes/choreRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const MONGO_URL = process.env.MONGO_URL;

// CORS middleware to allow frontend communication
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGIN || 'https://your-frontend-domain.com'
        : ["http://localhost:3001", "http://localhost:3000"],
    credentials: true
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data must come BEFORE routes
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        message: "ChoreChamp API is running successfully!",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chores", choreRoutes);

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
