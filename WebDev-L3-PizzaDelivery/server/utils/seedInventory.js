const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Inventory = require("../models/Inventory");

dotenv.config();

const inventoryData = [
    { name: "Classic Pizza Base", type: "base", quantity: 50, lowStockThreshold: 10 },
    { name: "Thin Crust Base", type: "base", quantity: 35, lowStockThreshold: 10 },

    { name: "Tomato Sauce", type: "sauce", quantity: 80, lowStockThreshold: 15 },
    { name: "Spicy Peri Peri Sauce", type: "sauce", quantity: 40, lowStockThreshold: 10 },

    { name: "Mozzarella Cheese", type: "cheese", quantity: 60, lowStockThreshold: 15 },
    { name: "Cheddar Cheese", type: "cheese", quantity: 45, lowStockThreshold: 10 },

    { name: "Onion", type: "vegetable", quantity: 100, lowStockThreshold: 20 },
    { name: "Capsicum", type: "vegetable", quantity: 80, lowStockThreshold: 20 },
    { name: "Sweet Corn", type: "vegetable", quantity: 70, lowStockThreshold: 15 },
    { name: "Jalapeno", type: "vegetable", quantity: 45, lowStockThreshold: 10 },
];

const seedInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingItems = await Inventory.countDocuments();

        if (existingItems > 0) {
            console.log("Inventory already exists.");
            process.exit(0);
        }

        await Inventory.insertMany(inventoryData);

        console.log("Inventory seeded successfully 🍕");
        process.exit(0);
    } catch (error) {
        console.error("Inventory seed failed:", error.message);
        process.exit(1);
    }
};

seedInventory();