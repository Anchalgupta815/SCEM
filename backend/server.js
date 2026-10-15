const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes =
    require("./routes/registrationRoutes");
const notificationRoutes =
    require("./routes/notificationRoutes");


// Load environment variables
dotenv.config();


// Connect MongoDB
connectDB();


const app = express();

const PORT = process.env.PORT || 5000;


// =====================================
// CORS
// =====================================

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// =====================================
// JSON Middleware
// =====================================

// Middleware

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(
    "/api/notifications",
    notificationRoutes
);

// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

    res.send(
        "Smart College Event Management System API is running!"
    );

});


// =====================================
// TEST API
// =====================================

app.get("/api/test", (req, res) => {

    res.json({

        success: true,

        message: "Backend API is working!"

    });

});


// =====================================
// AUTHENTICATION ROUTES
// =====================================

app.use(
    "/api/auth",
    authRoutes
);
app.use("/api/events", eventRoutes);
app.use(
    "/api/registrations",
    registrationRoutes
);

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});