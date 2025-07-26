import mongoose from "mongoose";

// 2. Define the User Schema
// This schema defines the structure and types of data for each user document
// in your MongoDB collection.
const userSchema = new mongoose.Schema(
    {
        // Username field:
        // - Type: String
        // - Required: true (a user must have a username)
        // - Unique: true (no two users can have the same username)
        // - Trim: true (removes leading/trailing whitespace)
        // - Minlength: 3 (minimum length for username)
        username: {
            type: String,
            required: [true, 'Please add a username'], // Custom error message if not provided
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
        },
        // Email field:
        // - Type: String
        // - Required: true (a user must have an email)
        // - Unique: true (no two users can have the same email)
        // - Match: A regular expression to validate email format
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please enter a valid email address',
            ],
        },
        // Password field:
        // - Type: String
        // - Required: true (a user must have a password)
        // - Minlength: 8 (minimum length for password)
        // - Custom validation for strong password requirements
        // Note: The actual password hashing will happen before saving to the database,
        // not directly in the schema definition.
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [8, 'Password must be at least 8 characters long'],
            validate: {
                validator: function (password) {
                    // Strong password requirements:
                    // - At least 8 characters
                    // - At least one uppercase letter
                    // - At least one lowercase letter
                    // - At least one number
                    // - At least one special character
                    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return strongPasswordRegex.test(password);
                },
                message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
            }
        },
        // Group ID field:
        // - Type: Mongoose.Schema.Types.ObjectId (This is how Mongoose stores references to other documents)
        // - Ref: 'Group' (This tells Mongoose that this ObjectId refers to a document in the 'groups' collection,
        //        which will be managed by the 'Group' model we'll create later).
        // - Optional: A user might not be in a group immediately after registration.
        groupIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group', // Refers to the 'Group' model
        }],
        // Points field for gamification:
        // - Type: Number
        // - Default: 0 (users start with 0 points)
        points: {
            type: Number,
            default: 0,
        },
        // Streak field for consistent completion:
        // - Type: Number
        // - Default: 0 (users start with 0 streak)
        streak: {
            type: Number,
            default: 0,
        },
        // Assigned Chores: An array of references to Chore documents
        // - Type: Array of Mongoose.Schema.Types.ObjectId
        // - Ref: 'Chore' (Refers to the 'Chore' model we'll create later)
        assignedChores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chore',
            },
        ],
        // Completed Chores: An array of references to ChoreLog documents
        // - Type: Array of Mongoose.Schema.Types.ObjectId
        // - Ref: 'ChoreLog' (Refers to the 'ChoreLog' model we'll create later)
        completedChores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ChoreLog',
            },
        ],
    },
    {
        // Schema Options:
        // - timestamps: true adds `createdAt` and `updatedAt` fields automatically.
        //   These fields will store the timestamp of when the document was created
        //   and last updated, respectively. This is very useful for tracking.
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema)
export default User;