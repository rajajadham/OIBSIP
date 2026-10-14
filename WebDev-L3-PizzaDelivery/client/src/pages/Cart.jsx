import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalAmount,
    } = useCart();

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <div>🛒</div>
                    <h1>Your Cart is Empty</h1>
                    <p>Add some delicious pizzas to continue.</p>

                    <Link to="/menu" className="hero-btn">
                        Browse Menu 🍕
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <nav className="navbar">
                <div className="logo">
                    Pizza<span>Go</span> 🍕
                </div>

                <Link to="/menu">← Continue Shopping</Link>
            </nav>

            <div className="cart-container">
                <div>
                    <h1>Your Cart 🛒</h1>

                    {cart.map((item) => (
                        <div className="cart-item" key={item._id}>
                            <img
                                src={item.image}
                                alt={item.name}
                            />

                            <div className="cart-item-info">
                                <h2>{item.name}</h2>
                                <p>₹{item.price} each</p>

                                <div className="quantity">
                                    <button
                                        onClick={() =>
                                            decreaseQuantity(item._id)
                                        }
                                    >
                                        −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(item._id)
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() =>
                                        removeFromCart(item._id)
                                    }
                                >
                                    Remove
                                </button>
                            </div>

                            <strong>
                                ₹{item.price * item.quantity}
                            </strong>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>

                    <div>
                        <span>Subtotal</span>
                        <strong>₹{totalAmount}</strong>
                    </div>

                    <div>
                        <span>Delivery</span>
                        <strong>FREE</strong>
                    </div>

                    <hr />

                    <div className="grand-total">
                        <span>Total</span>
                        <strong>₹{totalAmount}</strong>
                    </div>

                   <Link to="/checkout" className="checkout-btn">
                      Proceed to Checkout
                   </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;
