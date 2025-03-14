const express = require('express');
const connectDB = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const { admin } = require('./middlewares/auth');
const User = require('./models/user');  // Ensure model name starts with uppercase

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB().then(() => console.log("✅ Database Connected Successfully")).catch(err => console.error("❌ Database Connection Failed:", err));

// Middleware to parse JSON requests
app.use(express.json());

app.post('/signUp', async (req, res) => {
    try {
        console.log("hello");
        const user = new User({
            firstName: "Ankush",
            lastName: "Kumar",
        });

        await user.save(); // Use await to ensure it saves before responding
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
