const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: (req, res, next) => {
        const db = req.app.get('db');
        const { username: user, password } = req.body;

        db.users.findOne({ username: user })
            .then(user => {
                if (user)
                    throw "Username is taken";
                else
                    return bcrypt.hash(password, saltRounds);
            })
            .then(hash => {
                return db.users.insert({
                    username: user,
                    password_hash: hash
                });
            })
            .then(user => {
                req.session.user = user;

                res.send({
                    didRegister: true,
                    message: "User registered",
                    username: user
                });
            })
            .catch(err => {
                res.send({
                    didRegister: false,
                    message: err,
                    username: null
                });
            })
    },
    login: (req, res, next) => {
        const db = req.app.get('db');
        const { username: user, password } = req.body;

        db.users.findOne({ username: user })
            .then(user => {
                if (user)
                    return bcrypt.compare(password, user.password_hash);
                else
                    throw "Invalid username";
            })
            .then(passwordMatched => {
                if (passwordMatched) {
                    req.session.user = user;

                    res.send({
                        didLogin: true,
                        message: "User found",
                        username: user
                    });
                } else
                    throw ('Incorrect password');
            })
            .catch(err => {
                res.send({
                    didLogin: false,
                    message: err,
                    username: null
                });
            });
    }
};