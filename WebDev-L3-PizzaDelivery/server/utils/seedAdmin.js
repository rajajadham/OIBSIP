const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@pizzago.com",
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "PizzaGo Admin",
            email: "admin@pizzago.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully 🍕");
        console.log("Email: admin@pizzago.com");
        console.log("Password: admin123");

        process.exit(0);
    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exit(1);
    }
};

seedAdmin();