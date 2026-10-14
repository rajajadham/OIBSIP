const razorpay = require("../utils/razorpay");
const Order = require("../models/Order");

const createPaymentOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
       if (!razorpay) {
             return res.status(503).json({
        success: false,
        message: "Razorpay test keys are not configured yet.",
    });
}

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required.",
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: `receipt_${order._id}`,
        });

        res.json({
            success: true,
            razorpayOrder,
        });
    } catch (error) {
        console.error("Razorpay order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create payment order.",
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = req.body;

        const crypto = require("crypto");

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature.",
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                user: req.user._id,
            },
            {
                paymentStatus: "paid",
            },
            {
                new: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        res.json({
            success: true,
            message: "Payment verified successfully.",
            order,
        });
    } catch (error) {
        console.error("Payment verification error:", error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed.",
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
};
