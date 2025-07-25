import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import protect from "../middleware/authMiddleware.js"
import { validatePassword } from "../utils/passwordValidator.js";


const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        console.log("received request body: ", req.body)
        const { username, email, password } = req.body;

        // Validate password strength before proceeding
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                message: "Password does not meet security requirements",
                errors: passwordValidation.errors
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            // If user exists, send a 400 Bad Request status with an error message
            return res
                .status(400)
                .json({ message: "User with that email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword, // Reminder: We will hash this password in the next step for security!
        });

        // If user creation is successful, send a 201 Created status
        // and some basic user information (excluding the password)
        if (user) {
            res.status(201).json({
                message: "User registered successfully!",
                _id: user._id,
                username: user.username,
                email: user.email,
                points: user.points, // Include default points from schema
                streak: user.streak, // Include default streak from schema
            });
        } else {
            // This 'else' block is a fallback for cases where Mongoose.create()
            // might not throw an error but also doesn't return a user object.
            // Mongoose validation errors typically go to the catch block.
            res.status(400).json({ message: "Invalid user data provided." });
        }
    } catch (error) {
        // Log the full error for debugging on the server console (not sent to client)
        console.error("Error during user registration:", error);

        // Provide more specific error messages to the client based on the error type
        if (error.code === 11000) {
            // MongoDB duplicate key error (e.g., if username was also unique)
            res.status(400).json({ message: "Username or email is already taken." });
        } else if (error.name === "ValidationError") {
            // Mongoose validation errors (e.g., required field missing, minlength)
            // Extract specific validation error messages from Mongoose
            const messages = Object.values(error.errors).map((val) => val.message);
            res.status(400).json({ message: messages.join(", ") });
        } else {
            // Generic server error for unexpected issues
            res
                .status(500)
                .json({
                    message: "Server error during registration. Please try again later.",
                });
        }
    }
});

router.post("/login", async (req, res) => {
    try {
        console.log("=== LOGIN REQUEST ===");
        console.log("Request body:", req.body);

        const { email, password } = req.body;
        console.log("Email:", email);
        console.log("Password provided:", !!password);

        const user = await User.findOne({ email });
        console.log("User found:", !!user);

        if (!user) {
            console.log("ERROR: User not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.log("ERROR: Password mismatch");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("SUCCESS: Login successful for user:", user.username);
        res.status(200).json({
            message: "Login successful!",
            _id: user._id,
            username: user.username,
            email: user.email,
            points: user.points,
            streak: user.streak,
            token: generateToken(user._id)
        });
    } catch (err) {
        console.error("=== LOGIN ERROR ===");
        console.error("Error during user login: ", err);
        res
            .status(500)
            .json({ message: "Server error during login. Please try again later." });
    }
});

export default router;
