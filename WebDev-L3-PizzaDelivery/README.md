# Pizza Delivery App

A full-stack pizza ordering and delivery web application built with React, Express, and MongoDB. The app allows users to browse pizzas, build custom pizzas, add items to a cart, place orders, and manage order history.

## Features

- User registration and login
- Pizza menu browsing
- Custom pizza builder
- Shopping cart and checkout flow
- Order placement and tracking
- Admin dashboard for managing orders
- Payment integration with Razorpay
- Real-time communication support with Socket.IO
- Responsive frontend for desktop and mobile users

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- Payments: Razorpay
- Real-time updates: Socket.IO

## Project Structure

```bash
WebDev-L3-PizzaDelivery/
├── client/                 # Frontend React app
│   ├── src/                # Application source files
│   ├── package.json        # Frontend dependencies and scripts
│   └── index.html          # Vite entry file
├── server/                 # Backend Express API
│   ├── config/             # Database config
│   ├── controllers/        # Route logic
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth and validation middleware
│   ├── server.js           # Server entry point
│   ├── .env                # Environment configuration
│   └── package.json        # Backend dependencies and scripts
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

## Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or newer recommended)
- npm or yarn
- MongoDB running locally or a MongoDB Atlas connection string

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd WebDev-L3-PizzaDelivery
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder with the following values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pizza_delivery
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

## Run the Application

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend app:

```bash
cd client
npm run dev
```

The frontend will typically run on:

- http://localhost:5173

The backend API will run on:

- http://localhost:5000

## Available Scripts

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Notes

This project is designed as a practical food delivery application that demonstrates a modern full-stack architecture, including authentication, order processing, and payment handling.

## License

This project is for educational use and may be used as a learning reference.
