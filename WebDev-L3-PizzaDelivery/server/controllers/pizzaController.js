const Pizza = require("../models/Pizza");

// Get all pizzas
const getPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find({ available: true }).sort({
            createdAt: -1,
        });

        res.json({
            success: true,
            count: pizzas.length,
            pizzas,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch pizzas",
            error: error.message,
        });
    }
};

// Get single pizza
const getPizzaById = async (req, res) => {
    try {
        const pizza = await Pizza.findById(req.params.id);

        if (!pizza) {
            return res.status(404).json({
                success: false,
                message: "Pizza not found",
            });
        }

        res.json({
            success: true,
            pizza,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch pizza",
            error: error.message,
        });
    }
};

// Create pizza
const createPizza = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, description, price and category are required",
            });
        }

        const pizza = await Pizza.create({
            name,
            description,
            price,
            category,
            image,
        });

        res.status(201).json({
            success: true,
            message: "Pizza created successfully",
            pizza,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create pizza",
            error: error.message,
        });
    }
};

module.exports = {
    getPizzas,
    getPizzaById,
    createPizza,
};
