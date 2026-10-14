const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Pizza = require("../models/Pizza");

dotenv.config();

const pizzas = [
    {
        name: "Margherita",
        description: "Classic cheese pizza with fresh tomato and basil.",
        price: 249,
        category: "veg",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    },
    {
        name: "Farmhouse",
        description: "Loaded with onion, capsicum, tomato and mushrooms.",
        price: 349,
        category: "veg",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    },
    {
        name: "Veggie Paradise",
        description: "Delicious mix of fresh vegetables and cheese.",
        price: 299,
        category: "veg",
        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
    },
    {
        name: "Chicken Pepperoni",
        description: "Cheesy pizza topped with delicious chicken pepperoni.",
        price: 399,
        category: "non-veg",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
    },
    {
        name: "Chicken Tikka",
        description: "Spicy chicken tikka with onion, capsicum and cheese.",
        price: 429,
        category: "non-veg",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498",
    },
];

const seedPizzas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Pizza.deleteMany();
        await Pizza.insertMany(pizzas);

        console.log("Pizza data seeded successfully 🍕");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedPizzas();
