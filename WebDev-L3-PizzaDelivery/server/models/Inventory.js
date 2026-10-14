const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ["base", "sauce", "cheese", "vegetable"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);