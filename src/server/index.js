// src/server/index.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the 'dist' directory
app.use(express.static('dist'));

// Serve the index.html file
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../../dist/index.html')); // Adjust the path accordingly
});

// Start the server
const server = app.listen(port, async () => {
    console.log('The server is running on http://localhost:8080');
});

// Export app and server for testing
// Export the app and server for testing
module.exports = { app, server };

// For testing
const sum = (a, b) => {
    return a + b;
};

module.exports.sum = sum; // Export the sum function
