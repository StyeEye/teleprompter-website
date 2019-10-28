const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 60000000 }
    }));
}