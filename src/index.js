const express = require('express');
const connectDB = require('./db');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

// Start the server and export the http.Server object
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Export the server object
module.exports = server;