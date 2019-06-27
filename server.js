// Imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
require('dotenv').config();

const controller = require('./server/controller');

// Setup
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Database setup
massive(process.env.CONNECTION_STRING)
    .then(database => {
        app.set("db", database);
        console.log("Database connected");
    })
    .catch(error => {
        console.log(`Database connection failed: ${error}`);
    });

// Endpoints
app.post("/auth/register", controller.register);
app.post("/auth/login", controller.login);
app.post("/auth/me", controller.me);

app.post("/api/project", controller.getProject);

// Startup
const port = process.env.PORT || 8090;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});