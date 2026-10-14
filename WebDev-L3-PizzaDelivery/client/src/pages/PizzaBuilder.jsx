import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const bases = [
    { name: "Classic Base", price: 80 },
    { name: "Thin Crust", price: 100 },
    { name: "Cheese Burst Base", price: 150 },
    { name: "Whole Wheat Base", price: 120 },
    { name: "Italian Herb Base", price: 130 },
];

const sauces = [
    { name: "Tomato Sauce", price: 30 },
    { name: "Peri Peri Sauce", price: 40 },
    { name: "BBQ Sauce", price: 45 },
    { name: "Pesto Sauce", price: 60 },
    { name: "Spicy Mexican Sauce", price: 50 },
];

const cheeses = [
    { name: "Mozzarella", price: 60 },
    { name: "Cheddar", price: 70 },
    { name: "Cheese Blend", price: 80 },
];

const vegetables = [
    { name: "Onion", price: 20 },
    { name: "Capsicum", price: 25 },
    { name: "Sweet Corn", price: 30 },
    { name: "Jalapeno", price: 30 },
    { name: "Mushroom", price: 35 },
];

function PizzaBuilder() {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [base, setBase] = useState(bases[0]);
    const [sauce, setSauce] = useState(sauces[0]);
    const [cheese, setCheese] = useState(cheeses[0]);
    const [selectedVegetables, setSelectedVegetables] = useState([]);

    const toggleVegetable = (vegetable) => {
        setSelectedVegetables((current) => {
            const exists = current.some(
                (item) => item.name === vegetable.name
            );

            if (exists) {
                return current.filter(
                    (item) => item.name !== vegetable.name
                );
            }

            return [...current, vegetable];
        });
    };

    const vegetableTotal = selectedVegetables.reduce(
        (total, item) => total + item.price,
        0
    );

    const totalPrice =
        base.price +
        sauce.price +
        cheese.price +
        vegetableTotal;

    const handleAddToCart = () => {
        const customPizza = {
            _id: `custom-${Date.now()}`,
            name: "Custom Pizza",
            description: `${base.name}, ${sauce.name}, ${cheese.name}`,
            price: totalPrice,
            image:
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
            category: "veg",
            quantity: 1,
            custom: true,
            customization: {
                base: base.name,
                sauce: sauce.name,
                cheese: cheese.name,
                vegetables: selectedVegetables.map(
                    (item) => item.name
                ),
            },
        };

        addToCart(customPizza);

        alert("Custom Pizza added to cart! 🍕");

        navigate("/cart");
    };

    return (
        <div className="builder-page">
            <nav className="navbar">
                <div className="logo">
                    Pizza<span>Go</span> 🍕
                </div>

                <div className="nav-links">
                    <a href="/menu">Menu</a>
                    <a href="/cart">Cart 🛒</a>
                </div>
            </nav>

            <main className="builder-container">
                <div className="builder-header">
                    <p className="badge">CUSTOM PIZZA</p>

                    <h1>
                        Build Your
                        <span> Perfect Pizza</span>
                    </h1>

                    <p>
                        Choose your favourite base, sauce, cheese
                        and toppings.
                    </p>
                </div>

                <section className="builder-section">
                    <h2>🍞 Choose Your Base</h2>

                    <div className="builder-options">
                        {bases.map((item) => (
                            <button
                                key={item.name}
                                className={
                                    base.name === item.name
                                        ? "builder-option selected"
                                        : "builder-option"
                                }
                                onClick={() => setBase(item)}
                            >
                                <strong>{item.name}</strong>
                                <span>₹{item.price}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="builder-section">
                    <h2>🍅 Choose Your Sauce</h2>

                    <div className="builder-options">
                        {sauces.map((item) => (
                            <button
                                key={item.name}
                                className={
                                    sauce.name === item.name
                                        ? "builder-option selected"
                                        : "builder-option"
                                }
                                onClick={() => setSauce(item)}
                            >
                                <strong>{item.name}</strong>
                                <span>₹{item.price}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="builder-section">
                    <h2>🧀 Choose Your Cheese</h2>

                    <div className="builder-options">
                        {cheeses.map((item) => (
                            <button
                                key={item.name}
                                className={
                                    cheese.name === item.name
                                        ? "builder-option selected"
                                        : "builder-option"
                                }
                                onClick={() => setCheese(item)}
                            >
                                <strong>{item.name}</strong>
                                <span>₹{item.price}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="builder-section">
                    <h2>🫑 Choose Vegetables</h2>

                    <div className="builder-options">
                        {vegetables.map((item) => {
                            const selected =
                                selectedVegetables.some(
                                    (vegetable) =>
                                        vegetable.name === item.name
                                );

                            return (
                                <button
                                    key={item.name}
                                    className={
                                        selected
                                            ? "builder-option selected"
                                            : "builder-option"
                                    }
                                    onClick={() =>
                                        toggleVegetable(item)
                                    }
                                >
                                    <strong>
                                        {selected ? "✓ " : ""}
                                        {item.name}
                                    </strong>

                                    <span>₹{item.price}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="builder-summary">
                    <div>
                        <span>Base</span>
                        <strong>₹{base.price}</strong>
                    </div>

                    <div>
                        <span>Sauce</span>
                        <strong>₹{sauce.price}</strong>
                    </div>

                    <div>
                        <span>Cheese</span>
                        <strong>₹{cheese.price}</strong>
                    </div>

                    <div>
                        <span>Vegetables</span>
                        <strong>₹{vegetableTotal}</strong>
                    </div>

                    <hr />

                    <div className="builder-total">
                        <span>Total</span>
                        <strong>₹{totalPrice}</strong>
                    </div>

                    <button
                        className="builder-add-btn"
                        onClick={handleAddToCart}
                    >
                        Add Custom Pizza to Cart 🍕
                    </button>
                </section>
            </main>
        </div>
    );
}

export default PizzaBuilder;
