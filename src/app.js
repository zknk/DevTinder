const express = require('express');
const { errorHandler } = require('./utils/errorHandler');
const {admin}=require('./utils/auth');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.get('/admin',admin);
// Global error handler middleware

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/about', (req, res) => {
    res.send('About Us');
});
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
