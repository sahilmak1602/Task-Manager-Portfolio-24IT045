require("node:dns/promises").setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

require("dotenv").config();

const taskEvents = require("./listeners");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./models/Task");
const cache = require("./cache");
const User = require("./models/User");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;



// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Validate JSON content type for requests with a body
app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method) &&
        !req.is("application/json")) {
        return res.status(415).json({
            error: "Content-Type must be application/json"
        });
    }
    next();
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
}

// User registration
app.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                error: "Please enter a valid email"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Password must contain at least 8 characters"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                error: "Email is already registered"
            });
        }

        next(err);
    }
});

// User login
app.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
});

// Get current logged-in user
app.get("/me", authenticateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
});

// Validate task input before database operations
function validateTaskInput(req, res, next) {
    const { title, description, completed, priority } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    if (
        description !== undefined &&
        typeof description !== "string"
    ) {
        return res.status(400).json({
            error: "Description must be a string"
        });
    }

    if (
        completed !== undefined &&
        typeof completed !== "boolean"
    ) {
        return res.status(400).json({
            error: "Completed must be true or false"
        });
    }

    if (
        priority !== undefined &&
        !["low", "medium", "high"].includes(priority)
    ) {
        return res.status(400).json({
            error: "Priority must be low, medium, or high"
        });
    }

    req.body.title = title.trim();
    next();
}
// Get all tasks with in-memory caching
app.get("/tasks", authenticateToken, async (req, res, next) => {
    try {
        const cachedTasks = cache.get("all_tasks");

        if (cachedTasks !== undefined) {
            console.log("CACHE HIT: Returning cached tasks");
            return res.json(cachedTasks);
        }

        console.log("CACHE MISS: Fetching tasks from MongoDB");

        const tasks = await Task.find();

        cache.set("all_tasks", tasks);

        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

// Get a task by MongoDB ID


app.get("/tasks/:id", authenticateToken, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        next(err);
    }
});

// Create a task
app.post("/tasks", authenticateToken, validateTaskInput, async (req, res, next) => {   try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            priority: req.body.priority
        });
cache.del("all_tasks");
        res.status(201).json(task);
console.log(`[API] Response sent at ${new Date().toISOString()}`);

taskEvents.emit("task-created", task);
    } catch (err) {
        next(err);
    }
});

// Update a task
app.put("/tasks/:id", authenticateToken, validateTaskInput, async (req, res, next) => {    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed,
                priority: req.body.priority
            },
            {
                new: true,
                runValidators: true,
                omitUndefined: true
            }
        );

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
cache.del("all_tasks");
        res.json(task);
    } catch (err) {
        next(err);
    }
});

// Delete a task
app.delete("/tasks/:id", authenticateToken, async (req, res, next) => {    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid task ID" });
        }

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
cache.del("all_tasks");
        res.json({
            message: "Task deleted successfully",
            task
        });

taskEvents.emit("task-deleted", task);
    } catch (err) {
        next(err);
    }
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Validation failed",
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ error: "Invalid ID or data format" });
    }

    res.status(500).json({ error: "Internal server error" });
});

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from the .env file");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Task Manager API running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();