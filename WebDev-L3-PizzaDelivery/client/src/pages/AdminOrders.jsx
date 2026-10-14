import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const statusOptions = [
        "placed",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/orders/all",
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

    const updateStatus = async (orderId, status) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.patch(
                `http://localhost:5000/api/orders/${orderId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order._id === orderId
                        ? response.data.order
                        : order
                )
            );
        } catch (err) {
            alert(
                err.response?.data?.message ||
                    "Failed to update order status."
            );
        }
    };

    if (loading) {
        return (
            <div className="admin-state">
                <h2>Loading Orders... 🍕</h2>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <nav className="navbar">
                <div className="logo">
                    Pizza<span>Go</span> 🍕
                </div>

                <div className="nav-links">
                    <Link to="/admin">Inventory</Link>
                    <Link to="/">Home</Link>
                </div>
            </nav>

            <main className="admin-container">
                <div className="admin-header">
                    <p className="badge">ADMIN PANEL</p>

                    <h1>
                        Order
                        <span> Management</span>
                    </h1>

                    <p>
                        View customer orders and update delivery status.
                    </p>
                </div>

                {error && (
                    <div className="admin-message">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <div>📦</div>
                        <h2>No orders yet</h2>
                        <p>
                            New customer orders will appear here.
                        </p>
                    </div>
                ) : (
                    <section className="admin-orders-list">
                        {orders.map((order) => (
                            <article
                                className="admin-order-card"
                                key={order._id}
                            >
                                <div className="admin-order-top">
                                    <div>
                                        <span>Order ID</span>
                                        <strong>
                                            #{order._id.slice(-8)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Customer</span>
                                        <strong>
                                            {order.user?.name ||
                                                "Customer"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            {order.user?.email ||
                                                "N/A"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="admin-order-items">
                                    <h3>Items</h3>

                                    {order.items.map(
                                        (item, index) => (
                                            <div
                                                className="admin-order-item"
                                                key={`${order._id}-${index}`}
                                            >
                                                <span>
                                                    {item.name} ×{" "}
                                                    {item.quantity}
                                                </span>

                                                <strong>
                                                    ₹
                                                    {item.price *
                                                        item.quantity}
                                                </strong>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="admin-order-details">
                                    <div>
                                        <span>
                                            Delivery Address
                                        </span>
                                        <strong>
                                            {
                                                order.deliveryAddress
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Payment</span>
                                        <strong>
                                            {order.paymentMethod.toUpperCase()}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Total</span>
                                        <strong>
                                            ₹{order.totalAmount}
                                        </strong>
                                    </div>
                                </div>

                                <div className="admin-status-row">
                                    <span>Order Status</span>

                                    <select
                                        value={
                                            order.orderStatus
                                        }
                                        onChange={(e) =>
                                            updateStatus(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                    >
                                        {statusOptions.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status
                                                        .replaceAll(
                                                            "_",
                                                            " "
                                                        )
                                                        .toUpperCase()}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}

export default AdminOrders;