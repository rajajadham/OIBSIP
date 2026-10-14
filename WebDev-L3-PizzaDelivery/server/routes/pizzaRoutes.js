const express = require("express");

const {
    getPizzas,
    getPizzaById,
    createPizza,
} = require("../controllers/pizzaController");

const {
    protect,
    adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPizzas);

router.get("/:id", getPizzaById);

router.post("/", protect, adminOnly, createPizza);

module.exports = router;
