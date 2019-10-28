module.exports = {
    getEvents: (req, res, next) => {
        const db = req.app.get('db');

        return db.presentations.findOne({ user_id: req.session.userid })
            .then(presentation => {
                if (presentation)
                    return db.events.find({ presentation_id: presentation.id })
                else
                    throw "No presentation";
            })
            .then(events => {
                const output = events.map(e => {
                    //cconst stripe = require("stripe")("sk_test_qOux3W7iden878sB6Rwuhf9t0083wYYg4J");sole.log(e)
                    return {
                        eventId: e.id,
                        eventType: e.event_type,
                        eventData: JSON.parse(e.body_json),
                        dataVersion: e.data_version
                    }
                })
                return (output);
            })
            .catch(err => {
                return ({
                    success: false,
                    message: err
                })
            })
    },
    addEvent: (req, res, next) => {
        const db = req.app.get('db');

        return db.presentations.findOne({ user_id: req.session.userid })
            .then(presentation => {
                if (presentation) {
                    const { eventType, eventData, dataVersion } = req.body;

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
                return ({
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
                return ({
                    success: false,
                    message: err
                })
            })
    },
    removeEvent: (req, res, next) => {
        const db = req.app.get('db');
        const eventId = parseInt(req.query.eventId);
        //console.log(eventId)
        return db.verify_event_owner({ event_id: eventId, user_id: req.session.userid })
            .then(matches => {
                matches.forEach(e => {
                    db.events.destroy({ id: e.id })
                });
                return ({
                    success: true
                });
            })
            .catch(err => {
                return ({
                    success: false,
                    message: err
                })
            })
    },
    updateEvents: (req, res, next) => {
        const db = req.app.get('db');

        const updates = req.body;

        updates.forEach(e => {
            db.events.update({ id: e.eventId }, {
                event_type: e.eventType,
                body_json: JSON.stringify(e.eventData),
                data_version: e.dataVersion
            })
        })

        return ({
            success: true,
            message: "Update attempted"
        });
    }
}