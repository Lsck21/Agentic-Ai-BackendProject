require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const healthRouter = require("./routes/health");
const basketRouter = require("./routes/basketRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// Global Middleware
// ===============================
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug Middleware (Optional)
app.use("/api", (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// ===============================
// API Routes
// ===============================
app.use("/api", healthRouter);
app.use("/api", basketRouter);
app.use("/api", authRouter);

// ===============================
// Swagger Documentation
// ===============================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===============================
// 404 Route
// ===============================
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: err.message || "Internal Server Error"
    });
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
});