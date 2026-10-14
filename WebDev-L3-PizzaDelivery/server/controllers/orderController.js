const Order = require("../models/Order");
const Pizza = require("../models/Pizza");
const Inventory = require("../models/Inventory");

const createOrder = async (req, res) => {
    try {
        const {
            items,
            deliveryAddress,
            paymentMethod = "cod",
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required.",
            });
        }

        if (!deliveryAddress?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Delivery address is required.",
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const pizza = await Pizza.findById(item.pizza);

            if (!pizza) {
                return res.status(404).json({
                    success: false,
                    message: "Pizza not found.",
                });
            }

            if (!pizza.available) {
                return res.status(400).json({
                    success: false,
                    message: `${pizza.name} is currently unavailable.`,
                });
            }

            const quantity = Number(item.quantity);

            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid pizza quantity.",
                });
            }

            orderItems.push({
                pizza: pizza._id,
                name: pizza.name,
                price: pizza.price,
                quantity,
            });

            totalAmount += pizza.price * quantity;
        }

        // Check inventory before creating order
        const inventoryItems = await Inventory.find();

        for (const inventoryItem of inventoryItems) {
            if (inventoryItem.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `${inventoryItem.name} is out of stock.`,
                });
            }
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            paymentStatus:
                paymentMethod === "cod" ? "pending" : "pending",
            orderStatus: "placed",
        });

        // Automatically reduce basic inventory after successful order
        const stockReduction = Math.max(
            1,
            orderItems.reduce(
                (total, item) => total + item.quantity,
                0
            )
        );

        for (const inventoryItem of inventoryItems) {
            inventoryItem.quantity = Math.max(
                0,
                inventoryItem.quantity - stockReduction
            );

            await inventoryItem.save();
        }

        res.status(201).json({
            success: true,
            message: "Order created successfully.",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order.",
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        })
            .populate("items.pizza")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders.",
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.pizza")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders.",
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "placed",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled",
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status.",
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                orderStatus: status,
            },
            {
                new: true,
            }
        )
            .populate("user", "name email")
            .populate("items.pizza");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        res.json({
            success: true,
            message: "Order status updated.",
            order,
        });
    } catch (error) {
        console.error("Update order status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status.",
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
};