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

        //console.log(req.session)
        if(!req.session.userid) {
            res.send({
                success: false,
                message: "Bad session"
            });

            return;
        }

        db.presentations.findOne({ user_id: parseInt(req.session.userid) })
            .then(presentation => {
                //console.log(req.session.userid, presentation)
                if (presentation) {
                    return presentation;
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
            .then(newPresentation => {
                //console.log(newPresentation)
                if (!newPresentation)
                    throw "Something went wrong";
                res.send({
                    projectId: newPresentation.id,
                    projectName: newPresentation.name,
                    projectJson: newPresentation.body_json,
                    dataVersion: newPresentation.data_version
                })
            })
            .catch(err => {
                console.log(err)
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
                if (presentation)
                    return db.events.find({presentation_id:  presentation.id})
                else
                    throw "No presentation";
            })
            .then(events => {
                const output = events.map(e => {
                    //console.log(e)
                    return {
                        eventId: e.id,
                        eventType: e.event_type,
                        eventData: JSON.parse(e.body_json),
                        dataVersion: e.data_version
                    }
                })
                res.send(output);
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err
                })
            })
    },
    addEvent: (req, res, next) => {
        const db = req.app.get('db');

        db.presentations.findOne({ user_id: req.session.userid })
            .then(presentation => {
                if (presentation) {
                    const {eventType, eventData, dataVersion} = req.body;

                    return db.events.insert({
                        presentation_id: presentation.id,
                        event_type: eventType,
                        body_json: JSON.stringify(eventData),
                        data_version: dataVersion
                    })
                }
                else
                    throw "No presentation";
            })
            .then(event => {
                res.send({
                    success: true,
                    event: {
                        eventId: event.id,
                        eventType: event.event_type,
                        eventData: JSON.parse(event.body_json),
                        dataVersion: event.data_version
                    }
                });
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err
                })
            })
    },
    removeEvent: (req, res, next) => {
        const db = req.app.get('db');
        const eventId = parseInt(req.query.eventId);
        //console.log(eventId)
        db.verify_event_owner({event_id: eventId, user_id: req.session.userid})
            .then(matches => {
                matches.forEach(e => {
                    db.events.destroy({id: e.id})
                });
                res.send({
                    success: true
                });
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err
                })
            })
    },
    updateEvents: (req, res, next) => {
        const db = req.app.get('db');

        const updates = req.body;

        updates.forEach(e => {
            db.events.update({id: e.eventId}, {
                event_type: e.eventType,
                body_json: JSON.stringify(e.eventData),
                data_version: e.dataVersion
            })
        })

        res.send({
            success: true,
            message: "Update attempted"
        });
    }
};