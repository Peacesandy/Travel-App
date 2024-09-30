const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 8080;

// Serve static files from the 'dist' directory
app.use(express.static('dist'));



// Send index.html on the root route
app.get("/", function (req, res) {
    res.sendFile("dist/index.html");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
