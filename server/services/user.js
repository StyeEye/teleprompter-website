const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    register: (req, res, next) => {
        const db = req.app.get('db');
        const { username, password } = req.body;

        let userObject = {};

        return db.users.findOne({ username })
            .then(user => {
                if (user)
                    throw "Username is taken";
                else
                    return bcrypt.hash(password, saltRounds);
            })
            .then(hash => {
                return db.users.insert({
                    username: username,
                    password_hash: hash
                });
            })
            .then(user => {
                userObject = user;
                delete userObject.password;

                req.session.user = userObject.username;
                req.session.userid = userObject.id;

                return ({
                    didRegister: true,
                    message: "User registered",
                    username: userObject.username
                });
            })
            .catch(err => {
                return ({
                    didRegister: false,
                    message: err,
                    username: null
                });
            })
    },
    login: (req, res, next) => {
        const db = req.app.get('db');
        const { username, password } = req.body;

        let userObject = {};

        return db.users.findOne({ username })
            .then(user => {
                if (user) {
                    userObject = user;
                    return bcrypt.compare(password, user.password_hash);
                } else
                    throw "Invalid username";
            })
            .then(passwordMatched => {
                if (passwordMatched) {
                    delete userObject.password;

                    req.session.user = userObject.username;
                    req.session.userid = userObject.id;

                    return {
                        didLogin: true,
                        message: "User found",
                        username: userObject.username
                    };
                } else
                    throw ('Incorrect password');
            })
            .catch(err => {
                return {
                    didLogin: false,
                    message: err,
                    username: null
                };
            });
    },
    logout: (req, res, next) => {
        req.session.destroy();
        return ({
            success: true
        });
    },
    me: (req, res, next) => {
        if (req.session.user)
            return ({ success: true, username: req.session.user })
        else
            return ({ success: false, username: null })
    }
};