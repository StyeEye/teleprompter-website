const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: (req, res, next) => {
        const db = req.app.get('db');
        const { username, password } = req.body;

        let userObject = {};

        db.users.findOne({ username })
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

                res.send({
                    didRegister: true,
                    message: "User registered",
                    username: userObject.username
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
        const { username, password } = req.body;

        let userObject = {};

        db.users.findOne({ username })
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

                    res.send({
                        didLogin: true,
                        message: "User found",
                        username: userObject.username
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
    },
    me: (req, res, next) => {
        if (req.session.user)
            res.send({ success: true, username: req.session.user })
        else
            res.send({ success: false, username: null })
    },
    getProject: (req, res, next) => {
        const db = req.app.get('db');

        db.presentations.findOne({ user_id: req.session.userid })
            .then(presentation => {
                if (presentation) {
                    res.send({
                        projectId: presentation.id,
                        projectName: presentation.name,
                        projectJson: presentation.body_json,
                        dataVersion: presentation.data_version
                    })
                }
                else {
                    return db.presentations.insert({
                        user_id: req.session.userid,
                        name: "Presentation",
                        body_json: "",
                        data_version: 1
                    })
                }
            })
            .then(presentation => {
                res.send({
                    projectId: presentation.id,
                    projectName: presentation.name,
                    projectJson: presentation.body_json,
                    dataVersion: presentation.data_version
                })
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err
                })
            })
    },
    getEvents: (req, res, next) => {
        const db = req.app.get('db');

        db.presentations.findOne({ user_id: req.session.userid })
            .then(presentation => {
                if (presentation) {
                    res.send({
                        projectId: presentation.id,
                        projectName: presentation.name,
                        projectJson: presentation.body_json,
                        dataVersion: presentation.data_version
                    })
                }
                else {
                    return db.presentations.insert({
                        user_id: req.session.userid,
                        name: "Presentation",
                        body_json: "",
                        data_version: 1
                    })
                }
            })
            .then(presentation => {
                res.send({
                    projectId: presentation.id,
                    projectName: presentation.name,
                    projectJson: presentation.body_json,
                    dataVersion: presentation.data_version
                })
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err
                })
            })
    }
};