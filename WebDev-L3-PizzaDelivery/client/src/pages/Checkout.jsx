import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Checkout() {
    const navigate = useNavigate();

    const {
        cart,
        totalAmount,
        clearCart,
    } = useCart();

    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const placeOrder = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!address.trim()) {
            setMessage("Please enter your delivery address.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const items = cart
                .filter((item) => !item.custom)
                .map((item) => ({
                    pizza: item._id,
                    quantity: item.quantity,
                }));

            if (items.length === 0) {
                setMessage(
                    "Custom pizza orders will be connected next."
                );
                setLoading(false);
                return;
            }

            // Create order in backend
            const orderResponse = await axios.post(
                "http://localhost:5000/api/orders",
                {
                    items,
                    deliveryAddress: address,
                    paymentMethod,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const createdOrder = orderResponse.data.order;

            // Cash on Delivery
            if (paymentMethod === "cod") {
                clearCart();

                setMessage(
                    "Order placed successfully! 🍕"
                );

                setTimeout(() => {
                    navigate("/orders");
                }, 800);

                return;
            }

            // Razorpay payment order
            const paymentResponse = await axios.post(
                "http://localhost:5000/api/payment/create",
                {
                    orderId: createdOrder._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const razorpayOrder =
                paymentResponse.data.razorpayOrder;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: razorpayOrder.amount,

                currency: razorpayOrder.currency,

                name: "PizzaGo",

                description: "PizzaGo Pizza Order",

                order_id: razorpayOrder.id,

                handler: async function (response) {
                    try {
                        await axios.post(
                            "http://localhost:5000/api/payment/verify",
                            {
                                orderId: createdOrder._id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        clearCart();

                        setMessage(
                            "Payment successful! Order placed 🍕"
                        );

                        setTimeout(() => {
                            navigate("/orders");
                        }, 800);
                    } catch (error) {
                        setMessage(
                            "Payment verification failed."
                        );
                    }
                },

                prefill: {
                    name:
                        JSON.parse(
                            localStorage.getItem("user")
                        )?.name || "",
                    email:
                        JSON.parse(
                            localStorage.getItem("user")
                        )?.email || "",
                },

                theme: {
                    color: "#ff5a1f",
                },
            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();
        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                    "Failed to place order."
            );
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="empty-cart">
                <div>🛒</div>

                <h1>Your Cart is Empty</h1>

                <p>
                    Add some pizzas before checkout.
                </p>

                <Link
                    to="/menu"
                    className="hero-btn"
                >
                    Browse Menu 🍕
                </Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <nav className="navbar">
                <div className="logo">
                    Pizza<span>Go</span> 🍕
                </div>

                <Link to="/cart">
                    ← Back to Cart
                </Link>
            </nav>

            <main className="checkout-container">
                <section className="checkout-form">
                    <p className="badge">
                        CHECKOUT
                    </p>

                    <h1>
                        Complete Your
                        <span> Order</span>
                    </h1>

                    <form onSubmit={placeOrder}>
                        <label>
                            Delivery Address
                        </label>

                        <textarea
                            value={address}
                            onChange={(e) =>
                                setAddress(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your complete delivery address"
                            rows="5"
                            required
                        />

                        <label>
                            Payment Method
                        </label>

                        <div className="payment-options">
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    value="cod"
                                    checked={
                                        paymentMethod ===
                                        "cod"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                Cash on Delivery
                            </label>

                            <label className="payment-option">
                                <input
                                    type="radio"
                                    value="razorpay"
                                    checked={
                                        paymentMethod ===
                                        "razorpay"
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                />

                                Razorpay Test Payment
                            </label>
                        </div>

                        {message && (
                            <p className="checkout-message">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="checkout-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : `Place Order • ₹${totalAmount}`}
                        </button>
                    </form>
                </section>

                <aside className="checkout-summary">
                    <h2>
                        Order Summary
                    </h2>

                    {cart.map((item) => (
                        <div
                            className="summary-item"
                            key={item._id}
                        >
                            <div>
                                <strong>
                                    {item.name}
                                </strong>

                                <span>
                                    × {item.quantity}
                                </span>
                            </div>

                            <strong>
                                ₹
                                {item.price *
                                    item.quantity}
                            </strong>
                        </div>
                    ))}

                    <hr />

                    <div className="summary-total">
                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{totalAmount}
                        </strong>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default Checkout;