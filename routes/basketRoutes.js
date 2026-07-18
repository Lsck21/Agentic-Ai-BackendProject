console.log("✅ Basket Routes Loaded");

const express = require("express");
const router = express.Router();

const {
    createBasket,
    getBaskets,
    updateBasket,
    deleteBasket,
    uploadBasketImage,
    uploadBasketImages
} = require("../controllers/basketController");

const validateBasket = require("../middleware/validateBasket");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Test Route
router.get("/test", (req, res) => {
    res.json({
        message: "Basket Route Working!"
    });
});

/**
 * @swagger
 * /baskets:
 *   post:
 *     summary: Create a new basket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fruit Basket
 *               price:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Basket created successfully
 *       400:
 *         description: Invalid input
 */
// Get All Baskets
router.get("/baskets", authMiddleware, getBaskets);

// Create Basket
router.post("/baskets", authMiddleware, validateBasket, createBasket);

// Update Basket
router.put("/baskets/:id", authMiddleware, validateBasket, updateBasket);

// Delete Basket
router.delete("/baskets/:id", authMiddleware, deleteBasket);

// Upload Basket Image
router.post(
    "/baskets/:id/image",
    authMiddleware,
    upload.single("image"),
    uploadBasketImage
);

router.post(
    "/baskets/:id/images",
    authMiddleware,
    upload.array("images", 5),
    uploadBasketImages
);

router.get("/hello", (req, res) => {
    res.json({
        message: "Hello from basket routes"
    });
});
module.exports = router;