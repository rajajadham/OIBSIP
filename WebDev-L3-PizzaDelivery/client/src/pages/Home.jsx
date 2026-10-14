import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <nav className="navbar">
                <div className="logo">Pizza<span>Go</span> 🍕</div>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </nav>

            <main className="hero">
                <div className="hero-content">
                    <p className="badge">HOT • FRESH • DELICIOUS</p>

                    <h1>
                        Your Favourite
                        <span> Pizza,</span>
                        <br />
                        Delivered Fast.
                    </h1>

                    <p>
                        Freshly baked pizzas made with premium ingredients
                        and delivered straight to your doorstep.
                    </p>

                    <Link to="/menu" className="hero-btn">
                        Order Now 🍕
                    </Link>
                </div>

                <div className="hero-pizza">
                    🍕
                </div>
            </main>

            <section className="features">
                <div>
                    <span>🔥</span>
                    <h3>Freshly Baked</h3>
                    <p>Prepared fresh for every order.</p>
                </div>

                <div>
                    <span>⚡</span>
                    <h3>Fast Delivery</h3>
                    <p>Hot pizza at your doorstep.</p>
                </div>

                <div>
<Link to="/menu" className="hero-btn">
    Order Now 🍕
</Link>                    <span>❤️</span>
                    <h3>Made With Love</h3>
                    <p>Quality ingredients in every bite.</p>
                </div>
            </section>
        </div>
    );
}

export default Home;
