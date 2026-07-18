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
 *   get:
 *     summary: Get all baskets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of baskets returned successfully.
 */
router.get("/baskets", authMiddleware, getBaskets);

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
 */
router.post("/baskets", authMiddleware, validateBasket, createBasket);

/**
 * @swagger
 * /baskets/{id}:
 *   put:
 *     summary: Update a basket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Basket
 *               price:
 *                 type: number
 *                 example: 700
 *     responses:
 *       200:
 *         description: Basket updated successfully
 */
router.put("/baskets/:id", authMiddleware, validateBasket, updateBasket);

/**
 * @swagger
 * /baskets/{id}:
 *   delete:
 *     summary: Delete a basket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Basket deleted successfully
 */
router.delete("/baskets/:id", authMiddleware, deleteBasket);

/**
 * @swagger
 * /baskets/{id}/image:
 *   post:
 *     summary: Upload a single basket image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 */
router.post(
    "/baskets/:id/image",
    authMiddleware,
    upload.single("image"),
    uploadBasketImage
);

/**
 * @swagger
 * /baskets/{id}/images:
 *   post:
 *     summary: Upload multiple basket images
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 */
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