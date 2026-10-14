import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Menu() {
    const [pizzas, setPizzas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { addToCart, totalItems } = useCart();

    useEffect(() => {
        const fetchPizzas = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/pizzas"
                );

                setPizzas(response.data.pizzas);
          } catch (err) {
    console.error("Pizza API Error:", err);
    setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load pizzas."
    );
} finally {
    setLoading(false);
}
        };

        fetchPizzas();
    }, []);

    if (loading) {
        return (
            <div className="menu-state">
                <h2>Loading pizzas... 🍕</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="menu-state">
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div className="menu-page">
            <nav className="navbar">
                <div className="logo">
                    Pizza<span>Go</span> 🍕
                </div>

                <a href="/">Home</a>

                <a href="/cart">
                    Cart 🛒 ({totalItems})
                </a>

            </nav>

            <section className="menu-header">
                <p className="badge">OUR MENU</p>

                <h1>
                    Choose Your
                    <span> Favourite Pizza</span>
                </h1>

                <p>
                    Fresh ingredients, delicious toppings and
                    unforgettable taste.
                </p>
            </section>

            <section className="pizza-grid">
                {pizzas.map((pizza) => (
                    <div className="pizza-card" key={pizza._id}>
                        <img
                            src={pizza.image}
                            alt={pizza.name}
                        />

                        <div className="pizza-info">
                            <div className="pizza-title">
                                <h2>{pizza.name}</h2>

                                <span className={`category ${pizza.category}`}>
                                    {pizza.category === "veg"
                                        ? "VEG"
                                        : "NON-VEG"}
                                </span>
                            </div>

                            <p>{pizza.description}</p>

                            <div className="pizza-bottom">
                                <strong>₹{pizza.price}</strong>

                                <button onClick={() => addToCart(pizza)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Menu;
