import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/inventory",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInventory(response.data.inventory || []);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("Admin access required.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to load inventory."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "admin") {
            navigate("/login");
            return;
        }

        fetchInventory();
    }, []);

    const updateQuantity = async (id, quantity) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.patch(
                `http://localhost:5000/api/inventory/${id}`,
                { quantity: Number(quantity) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInventory((current) =>
                current.map((item) =>
                    item._id === id ? response.data.item : item
                )
            );
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to update inventory."
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="admin-state">
                <h2>Loading Admin Dashboard... 🍕</h2>
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
                    <Link to="/admin/orders">Orders</Link>
                    <Link to="/">Home</Link>
                    <button onClick={logout}>Logout</button>
                </div>
            </nav>

            <main className="admin-container">
                <div className="admin-header">
                    <div>
                        <p className="badge">ADMIN PANEL</p>
                        <h1>
                            Inventory
                            <span> Dashboard</span>
                        </h1>
                        <p>
                            Manage pizza ingredients and stock levels.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="admin-message">
                        {error}
                    </div>
                )}

                <section className="inventory-grid">
                    {inventory.map((item) => {
                        const lowStock =
                            item.quantity <= item.lowStockThreshold;

                        return (
                            <article
                                className={`inventory-card ${
                                    lowStock ? "low-stock" : ""
                                }`}
                                key={item._id}
                            >
                                <div className="inventory-top">
                                    <div>
                                        <span className="inventory-type">
                                            {item.type}
                                        </span>
                                        <h2>{item.name}</h2>
                                    </div>

                                    <span
                                        className={
                                            lowStock
                                                ? "stock-badge danger"
                                                : "stock-badge"
                                        }
                                    >
                                        {lowStock
                                            ? "LOW STOCK"
                                            : "IN STOCK"}
                                    </span>
                                </div>

                                <div className="stock-info">
                                    <div>
                                        <span>Available</span>
                                        <strong>{item.quantity}</strong>
                                    </div>

                                    <div>
                                        <span>Minimum</span>
                                        <strong>
                                            {item.lowStockThreshold}
                                        </strong>
                                    </div>
                                </div>

                                <div className="stock-actions">
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            setInventory((current) =>
                                                current.map((stockItem) =>
                                                    stockItem._id === item._id
                                                        ? {
                                                              ...stockItem,
                                                              quantity:
                                                                  e.target.value,
                                                          }
                                                        : stockItem
                                                )
                                            )
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item._id,
                                                item.quantity
                                            )
                                        }
                                    >
                                        Update Stock
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;