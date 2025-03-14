const admin = (req, res, next) => {
    const token = req.headers.authorization; // Get token from request headers

    if (token === 'ABC') {
        res.send("Welcome, Admin!");
    } else {
        res.status(403).json({ message: "You are not authorized to access this route" });
    }
};

module.exports = { admin };
