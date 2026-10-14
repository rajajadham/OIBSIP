import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                form
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage("Account created successfully! 🍕");

            setTimeout(() => {
                navigate("/");
            }, 700);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">🍕</div>

                <h1>Create Account</h1>
                <p>Join PizzaGo and start ordering delicious pizzas.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={form.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                {message && (
                    <p style={{ color: "#ff6a2a", marginTop: "15px" }}>
                        {message}
                    </p>
                )}

                <p className="auth-bottom">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
