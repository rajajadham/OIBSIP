import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login to view your orders.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    "http://localhost:5000/api/orders/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setOrders(response.data.orders || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="menu-state">
                <h2>Loading your orders... 🍕</h2>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <nav className="navbar">
                <div className="logo">
                    Pizza<span>Go</span> 🍕
                </div>

                <div className="nav-links">
                    <Link to="/menu">Menu</Link>
                    <Link to="/cart">Cart 🛒</Link>
                </div>
            </nav>

            <main className="orders-container">
                <div className="orders-header">
                    <p className="badge">MY ORDERS</p>

                    <h1>
                        Your
                        <span> Orders</span>
                    </h1>

                    <p>
                        Track your pizza orders and delivery status.
                    </p>
                </div>

                {error && (
                    <div className="order-message">
                        {error}
                    </div>
                )}

                {!error && orders.length === 0 && (
                    <div className="empty-orders">
                        <div>🍕</div>

                        <h2>No orders yet</h2>

                        <p>
                            You haven't placed any orders.
                        </p>

                        <Link
                            to="/menu"
                            className="hero-btn"
                        >
                            Order Pizza 🍕
                        </Link>
                    </div>
                )}

                <section className="orders-list">
                    {orders.map((order) => (
                        <article
                            className="order-card"
                            key={order._id}
                        >
                            <div className="order-top">
                                <div>
                                    <span>Order ID</span>
                                    <strong>
                                        #{order._id.slice(-8)}
                                    </strong>
                                </div>

                                <span
                                    className={`order-status ${order.orderStatus}`}
                                >
                                    {order.orderStatus
                                        .replaceAll("_", " ")
                                        .toUpperCase()}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <div
                                        className="order-item"
                                        key={`${order._id}-${index}`}
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
                                            ₹{item.price * item.quantity}
                                        </strong>
                                    </div>
                                ))}
                            </div>

                            <div className="order-bottom">
                                <div>
                                    <span>Delivery</span>
                                    <strong>
                                        {order.deliveryAddress}
                                    </strong>
                                </div>

                                <div>
                                    <span>Total</span>
                                    <strong>
                                        ₹{order.totalAmount}
                                    </strong>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}

export default Orders;