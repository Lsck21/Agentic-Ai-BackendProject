const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
        return res.status(401).json({
            error: "Access denied. No token provided."
        });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            error: "Invalid token format."
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request
        req.user = decoded;

        // Continue to next middleware/route
        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token."
        });
    }
};

module.exports = authMiddleware;