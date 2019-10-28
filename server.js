// Imports
const express = require('express');
const path = require('path');

const setUp = require('./server/middleware/setup');
const dbSetup = require('./server/middleware/database');
const endpointSetup = require('./server/controller');
require('dotenv').config();

// Setup
const app = express();

setUp(app);
dbSetup(app);

// Endpoints
app.use(express.static(path.join(__dirname, '/build')));

endpointSetup(app);

app.get('*', (req, res) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, "build")
    })
});

// Startup
const port = process.env.PORT || 8090;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});