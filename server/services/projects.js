module.exports = {
    getProject: (req, res, next) => {
        const db = req.app.get('db');

        //console.log(req.session)
        if (!req.session.userid) {
            return ({
                success: false,
                message: "Bad session"
            });

            return;
        }

        return db.presentations.findOne({ user_id: parseInt(req.session.userid) })
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
                return ({
                    projectId: newPresentation.id,
                    projectName: newPresentation.name,
                    projectJson: newPresentation.body_json,
                    dataVersion: newPresentation.data_version
                })
            })
            .catch(err => {
                console.log(err)
                return ({
                    success: false,
                    message: err
                })
            })
    }
};