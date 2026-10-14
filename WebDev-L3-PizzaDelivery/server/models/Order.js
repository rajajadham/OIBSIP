const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        pizza: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pizza",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must contain at least one item",
            },
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        deliveryAddress: {
            type: String,
            required: true,
            trim: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "razorpay"],
            default: "cod",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "preparing",
                "out_for_delivery",
                "delivered",
                "cancelled",
            ],
            default: "placed",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
